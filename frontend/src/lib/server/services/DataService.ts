import type { CalendarDate } from '@internationalized/date';
import { sql, type SelectExpression } from 'kysely';
import type { MeasurementResponse } from '../api/solarmax/Models';
import type { Database } from '../db/kysely/Database';
import { db } from '../db/kysely/db';

async function getOverview(date: CalendarDate) {
	const inverters = await db.selectFrom('inverter').selectAll().execute();

	const inverterLines = inverters.map(async (i) => {
		const data = (
			await db
				.selectFrom('measurement')
				.select(['created_at as x', 'pac as y'])
				.where('inverter_id', '=', i.id)
				.where(
					sql<boolean>`created_at between ${date.toString()}
					    and ${date.add({ days: 1 }).toString()}`
				)
				.execute()
		).map(({ x, y }) => ({ x: x.replace(' ', 'T') + 'Z', y }));

		return {
			name: i.name,
			data
		};
	});

	const combinedLineData = (
		await db
			.selectFrom('measurement')
			.select(['created_at as x', sql<number>`sum(pac)`.as('y')])
			.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
			.where('inverter.plant_id', '=', 1)
			.where(
				sql<boolean>`created_at between ${date.toString()} 
					  and ${date.add({ days: 1 }).toString()}`
			)
			.groupBy('created_at')
			.execute()
	).map(({ x, y }) => ({ x: x.replace(' ', 'T') + 'Z', y }));

	const lines = [{ name: 'Gesamt', data: combinedLineData }, ...inverterLines];

	const ivmax = inverters.reduce((acc, i) => acc + i.ivmax, 400);

	return {
		inverters,
		ivmax,
		day: date.toString(),
		lines: await Promise.all(lines)
	};
}

async function getLoad(plantId: number) {
	return (
		(
			await db
				.selectFrom('measurement')
				.select(sql<number>`sum(pac)`.as('sum'))
				.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
				.where('inverter.plant_id', '=', plantId)
				.groupBy('created_at')
				.orderBy('measurement.created_at', 'desc')
				.executeTakeFirst()
		)?.sum ?? 0
	);
}

async function saveMeasurement(measurement: MeasurementResponse[], date: string) {
	const ids = await db
		.selectFrom('inverter')
		.select(['id', 'addr'])
		.where(
			'addr',
			'in',
			measurement.map((m) => m.addr)
		)
		.execute();

	await db
		.insertInto('measurement')
		.values(
			measurement.map((m) => {
				const inverter_id = ids.find((i) => i.addr === m.addr)?.id;

				if (!inverter_id) throw new Error('Inverter not found');

				return {
					inverter_id,
					fdat: new Date(m.fdat).toISOString(),
					pac: m.pac,
					pdc: m.pdc,
					kdy: m.kdy,
					kt0: m.kt0,
					created_at: date
				};
			})
		)
		.execute();
}

async function exportMeasurements(format: string[], start: string, end: string) {
	const select = format.map((f) => {
		switch (f) {
			case 'date':
				return 'created_at';
			case 'pac':
				return sql<number>`sum(pac)`.as('pac');
			case 'pdc':
				return sql<number>`sum(pdc)`.as('pdc');
			case 'kdy':
				return sql<number>`sum(kdy)`.as('kdy');
			case 'kt0':
				return sql<number>`sum(kt0)`.as('kt0');
			default:
				return f;
		}
	}) as SelectExpression<Database, 'measurement'>[];

	return await db
		.selectFrom('measurement')
		.select(select)
		.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
		.where('inverter.plant_id', '=', 1)
		.where((eb) => eb.between('created_at', start, end))
		.groupBy('created_at')
		.execute();
}

export default {
	getOverview,
	getLoad,
	saveMeasurement,
	exportMeasurements
};
