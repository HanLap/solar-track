import type { CalendarDate, ZonedDateTime } from '@internationalized/date';
import { and, asc, between, desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import type { MeasurementResponse } from '../api/solarmax/Models';
import { db } from '../db/drizzle';
import { inverterTable, measurementTable, type Inverter } from '../db/drizzle/schema';
import type OldDataService from './DataService';

const getOverview = (async (date: CalendarDate) => {
	const inverters = await db
		.select({ ...getTableColumns(inverterTable), plant_id: inverterTable.plantId })
		.from(inverterTable)
		.execute();

	const inverterLines = inverters.map((i) => getInverterLine(i, date));
	const combinedLineData = getCombinedInverterLine(date);

	const lines = [combinedLineData, ...inverterLines];

	const ivmax = Math.ceil(inverters.reduce((acc, i) => acc + i.ivmax, 0) / 1000) * 1000 - 2000;

	const load = getLoad(1);

	return {
		inverters,
		ivmax,
		load,
		day: date.toString(),
		lines: await Promise.all(lines),
		loading: false
	};
}) satisfies (typeof OldDataService)['getOverview'];

type InverterLine = {
	name: string;
	data: { x: string; y: number }[];
};

async function getInverterLine(inverter: Inverter, date: CalendarDate): Promise<InverterLine> {
	const data = await db
		.select({ x: measurementTable.createdAt, y: measurementTable.pac })
		.from(measurementTable)
		.where(
			and(
				eq(measurementTable.inverterId, inverter.id),
				between(measurementTable.createdAt, date.toString(), date.add({ days: 1 }).toString())
			)
		)
		.orderBy(asc(measurementTable.createdAt))
		.execute();

	return { name: inverter.name, data };
}

async function getCombinedInverterLine(date: CalendarDate): Promise<InverterLine> {
	const data = await db
		.select({ x: measurementTable.createdAt, y: sql<number>`sum(${measurementTable.pac})` })
		.from(measurementTable)
		.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
		.where(
			and(
				eq(inverterTable.plantId, 1),
				between(measurementTable.createdAt, date.toString(), date.add({ days: 1 }).toString())
			)
		)
		.groupBy(measurementTable.createdAt)
		.orderBy(asc(measurementTable.createdAt))
		.execute();

	return { name: 'Gesamt', data };
}

async function getLoad(plantId: number) {
	return (
		(
			await db
				.select({ sum: sql<number>`sum(${measurementTable.pac})` })
				.from(measurementTable)
				.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
				.where(eq(inverterTable.plantId, plantId))
				.groupBy(measurementTable.createdAt)
				.orderBy(desc(measurementTable.createdAt))
				.execute()
		)[0]?.sum ?? undefined
	);
}

async function getMeasurementCount(plantId: number, start: CalendarDate, end: CalendarDate) {
	return (
		await db
			.select({ count: sql<number>`count(1)` })
			.from(measurementTable)
			.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
			.where(
				and(
					eq(inverterTable.plantId, plantId),
					between(measurementTable.createdAt, start.toString(), end.add({ days: 1 }).toString())
				)
			)
			.execute()
	)[0];
}

async function saveMeasurement(measurement: MeasurementResponse[], date: ZonedDateTime) {
	const inverters = await db.query.inverterTable.findMany({
		where: inArray(
			inverterTable.addr,
			measurement.map((m) => m.addr)
		)
	});

	const data = measurement.map((m) => {
		const inverterId = inverters.find((i) => i.addr === m.addr)?.id;

		if (!inverterId) throw new Error('Inverter not found');

		return {
			inverterId,
			fdat: new Date(m.fdat).toISOString(),
			pac: m.pac,
			pdc: m.pdc,
			kdy: m.kdy,
			kt0: m.kt0,
			createdAt: date.toAbsoluteString()
		} satisfies typeof measurementTable.$inferInsert;
	});

	console.log(data);

	await db.insert(measurementTable).values(data).execute();
}

export default {
	getMeasurementCount,
	getOverview,
	saveMeasurement
};
