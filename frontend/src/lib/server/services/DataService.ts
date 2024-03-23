import type { CalendarDate } from '@internationalized/date';
import { db } from '../db/db';
import { sql } from 'kysely';

export async function getOverview(date: CalendarDate) {
	const inverters = await db.selectFrom('inverter').selectAll().execute();

	const inverterLines = inverters.map(async (i) => {
		const data = (
			await db
				.selectFrom('measurement')
				.select(['created_at as x', 'pac as y'])
				.where('inverter_id', '=', i.id)
				.where(
					sql`created_at between ${date.toString()}
					    and ${date.add({ days: 1 }).toString()}`,
				)
				.execute()
		).map(({ x, y }) => ({ x: x.replace(' ', 'T') + 'Z', y }));

		return {
			name: i.name,
			data,
		};
	});

	const combinedLineData = (
		await db
			.selectFrom('measurement')
			.select(['created_at as x', sql<number>`sum(pac)`.as('y')])
			.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
			.where('inverter.plant_id', '=', 1)
			.where(
				sql`created_at between ${date.toString()} 
					  and ${date.add({ days: 1 }).toString()}`,
			)
			.groupBy('created_at')
			.execute()
	).map(({ x, y }) => ({ x: x.replace(' ', 'T') + 'Z', y }));

	const lines = [{ name: 'Gesamt', data: combinedLineData }, ...inverterLines];

	const ivmax = inverters.reduce((acc, i) => acc + i.ivmax, 400);

	const load = getLoad(1);

	return {
		inverters,
		ivmax,
		load,
		day: date.toString(),
		lines: await Promise.all(lines),
		loading: false,
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
		)?.sum ?? undefined
	);
}
