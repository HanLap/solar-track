import { createServer, type Socket } from 'node:net';

const PORT = Number(process.env.PORT ?? 12345);

// Inverters on the (mock) bus, addressed as in the solarmax-service (9 and 10).
// ivmax in W, typ is the SolarMax type code (20030 = 4200S, 20020 = 3000S).
type Inverter = {
	addr: number;
	typ: number;
	ivmax: number;
	scale: number;
	lifetimeBase: number;
};

const INVERTERS: Inverter[] = [
	{ addr: 9, typ: 20030, ivmax: 4200, scale: 0.92, lifetimeBase: 5230 },
	{ addr: 10, typ: 20020, ivmax: 3000, scale: 0.85, lifetimeBase: 4870 }
];

const SUNRISE = 6.0; // local hours
const SUNSET = 20.0;
const DC_AC_EFFICIENCY = 0.96;

// Deterministic pseudo random generator (for per-day weather).
function mulberry32(seed: number): () => number {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function dayKey(d: Date): number {
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Day-wide weather factor 0.25..1.0, stable for a given date and inverter.
function dayFactor(d: Date, addr: number): number {
	return 0.25 + 0.75 * mulberry32(dayKey(d) * 31 + addr)();
}

// Clear sky shape: sin^1.3 bell between sunrise and sunset, 0..1.
function clearSky(hour: number): number {
	if (hour <= SUNRISE || hour >= SUNSET) return 0;
	return Math.sin(((hour - SUNRISE) / (SUNSET - SUNRISE)) * Math.PI) ** 1.3;
}

// Slow-moving "cloud" noise, smooth over time but different per inverter.
function clouds(hour: number, d: Date, addr: number): number {
	const r = mulberry32(dayKey(d) + addr * 7);
	const p1 = r() * 6.28;
	const p2 = r() * 6.28;
	return 1 - 0.18 * (0.5 + 0.5 * Math.sin(hour * 1.7 + p1)) - 0.12 * (0.5 + 0.5 * Math.sin(hour * 5.3 + p2));
}

function hourOf(d: Date): number {
	return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
}

// Expected AC power (W) without per-request randomness.
function basePower(inv: Inverter, d: Date, hour: number): number {
	return inv.ivmax * inv.scale * dayFactor(d, inv.addr) * clearSky(hour) * clouds(hour, d, inv.addr);
}

// Energy produced so far today in kWh (numerical integration, monotonic).
function yieldToday(inv: Inverter, d: Date, hour: number): number {
	if (hour <= SUNRISE) return 0;
	const step = 5 / 60;
	let wh = 0;
	for (let h = SUNRISE; h < Math.min(hour, SUNSET); h += step) {
		const dt = Math.min(step, hour - h);
		wh += basePower(inv, d, h) * dt;
	}
	return wh / 1000;
}

// Instantaneous electrical values for one inverter.
type Measurement = ReturnType<typeof measure>;

function measure(inv: Inverter, now = new Date()) {
	const hour = hourOf(now);
	const noise = 1 + (Math.random() - 0.5) * 0.06;
	const pac = Math.max(0, basePower(inv, now, hour) * noise); // W
	const pdc = pac > 0 ? pac / (DC_AC_EFFICIENCY + (Math.random() - 0.5) * 0.02) : 0;
	const ul1 = pac > 0 ? 229 + Math.random() * 4 : 0; // V
	const udc = pdc > 0 ? 250 + 150 * Math.min(1, pdc / inv.ivmax) + Math.random() * 5 : 0; // V
	const kdy = yieldToday(inv, now, hour); // kWh
	const days = Math.max(0, Math.floor((now.getTime() - new Date(2024, 0, 1).getTime()) / 86400000));
	const kt0 = inv.lifetimeBase + days * 14 * inv.scale + kdy;
	return {
		pac,
		pdc,
		ul1,
		il1: ul1 ? pac / ul1 : 0,
		udc,
		idc: udc ? pdc / udc : 0,
		kdy,
		kt0,
		hour,
		now
	};
}

const hex = (n: number, pad = 0): string => Math.max(0, Math.round(n)).toString(16).toUpperCase().padStart(pad, '0');

// Encode a value the way the inverter does (inverse of normalize_value in solarmax.py).
function encodeValue(key: string, inv: Inverter, m: Measurement): string {
	const now = m.now;
	switch (key) {
		case 'ADR':
			return hex(inv.addr);
		case 'TYP':
			return hex(inv.typ);
		case 'PIN':
			return hex(inv.ivmax * 2);
		case 'PAC':
			return hex(m.pac * 2);
		case 'KDY':
			return hex(m.kdy * 10);
		case 'KT0':
			return hex(m.kt0);
		case 'KYR':
			return hex(m.kt0 - 5000);
		case 'KMT':
			return hex(m.kdy * 20);
		case 'UL1':
			return hex(m.ul1 * 10);
		case 'UDC':
			return hex(m.udc * 10);
		case 'IL1':
			return hex(m.il1 * 100);
		case 'IDC':
			return hex(m.idc * 100);
		case 'TNF':
			return hex(5000 + (Math.random() - 0.5) * 6); // ~50 Hz
		case 'TKK':
			return hex(25 + 30 * (m.pac / inv.ivmax) + Math.random() * 2);
		case 'PRL':
			return hex((m.pac / inv.ivmax) * 100);
		case 'SYS':
			return `${hex(m.pac > 0 ? 20004 : 20002)},0`;
		case 'SAL':
			return '0';
		case 'SDAT':
		case 'FDAT': {
			// date: year (3 hex digits), month (2), day (2); time: seconds since midnight
			const date = hex(now.getFullYear(), 3) + hex(now.getMonth() + 1, 2) + hex(now.getDate(), 2);
			// Time is always sent as 0: normalize_value() in solarmax.py computes the seconds
			// as `time % (3600*60)`, which raises for any time >= 60 s.
			return `${date},0`;
		}
		default:
			return '0';
	}
}

const checksum = (s: string): string => {
	let total = 0;
	for (const c of s) total += c.charCodeAt(0);
	return hex(total, 4);
};

function buildAnswer(inv: Inverter, values: string[]): string {
	const m = measure(inv);
	const data = values.map((k) => `${k}=${encodeValue(k, inv, m)}`).join(';');
	const body = `|64:${data}|`;
	// frame = '{' + addr ';FB;' len body checksum + '}'
	let lenDigits = 2;
	let total: number;
	for (;;) {
		total = 2 + 6 + lenDigits + body.length + 4;
		if (hex(total).length <= lenDigits) break;
		lenDigits++;
	}
	const content = `${hex(inv.addr, 2)};FB;${hex(total, lenDigits)}${body}`;
	return `{${content}${checksum(content)}}`;
}

// Request: {FB;<addr hex>;<len hex>|64:KEY;KEY;...|<checksum>}
function handleFrame(frame: string, socket: Socket): void {
	const m = /^\{FB;([0-9A-Fa-f]+);([0-9A-Fa-f]+)\|([0-9A-Fa-f]+):(.*)\|[0-9A-Fa-f]{4}\}$/.exec(frame);
	if (!m) {
		console.log(`ignoring malformed frame: ${frame}`);
		return;
	}
	const addr = parseInt(m[1], 16);
	const inv = INVERTERS.find((i) => i.addr === addr);
	if (!inv) {
		console.log(`no inverter ${addr}, not answering`); // like real hardware: silence
		return;
	}
	const answer = buildAnswer(inv, m[4].split(';').filter(Boolean));
	console.log(`${frame} => ${answer}`);
	socket.write(answer);
}

createServer((socket) => {
	console.log(`client connected: ${socket.remoteAddress}`);
	let buf = '';
	socket.setEncoding('ascii');
	socket.on('data', (chunk: string) => {
		buf += chunk;
		let end: number;
		while ((end = buf.indexOf('}')) >= 0) {
			handleFrame(buf.slice(0, end + 1).trim(), socket);
			buf = buf.slice(end + 1);
		}
	});
	socket.on('error', () => {});
	socket.on('close', () => console.log('client disconnected'));
}).listen(PORT, () => console.log(`solarmax-mock (inverters ${INVERTERS.map((i) => i.addr).join(', ')}) listening on :${PORT}`));
