import SolarApi from '$lib/server/api/solarmax';
import { db } from '$lib/server/db/db';
import * as MeasurmentService from '$lib/server/services/MeasurementService';
import * as datefns from 'date-fns';
import { sql } from 'kysely';
import type { Actions } from './$types.js';

export async function load({ url }) {
	const dayString = url.searchParams.get('day');
	const day = dayString ? datefns.parse(dayString, 'yyyy-MM-dd', new Date()) : new Date();

	const inverters = await db.selectFrom('inverter').selectAll().execute();

	const inverterLines = inverters.map(async (i) => {
		const data = (
			await db
				.selectFrom('measurement')
				.select(['created_at as x', 'pac as y'])
				.where('inverter_id', '=', i.id)
				.where(
					sql`created_at between ${datefns.format(
						datefns.addDays(day, -1),
						'yyyy-MM-dd'
					)} and ${datefns.format(datefns.addDays(day, 1), 'yyyy-MM-dd')}`
				)
				.execute()
		).map(({ x, y }) => ({ x: x + 'Z', y }));

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
				sql`created_at between ${datefns.format(
					datefns.addDays(day, -1),
					'yyyy-MM-dd'
				)} and ${datefns.format(datefns.addDays(day, 1), 'yyyy-MM-dd')}`
			)
			.groupBy('created_at')
			.execute()
	).map(({ x, y }) => ({ x: x + 'Z', y }));

	const lines = [{ name: 'Gesamt', data: combinedLineData }, ...inverterLines];

	const ivmax = inverters.reduce((acc, i) => acc + i.ivmax, 400);

	const load =
		(
			await db
				.selectFrom('measurement')
				.select(sql<number>`sum(pac)`.as('sum'))
				.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
				.where('inverter.plant_id', '=', 1)
				.groupBy('created_at')
				.orderBy('measurement.created_at', 'desc')
				.executeTakeFirst()
		)?.sum ?? undefined;

	return {
		inverters,
		ivmax,
		load,
		day: datefns.format(day, 'yyyy-MM-dd'),
		lines: Promise.all(lines)
	};
}

export const actions: Actions = {
	async getInverters({ fetch }) {
		const inverters = (await SolarApi.getInverters(fetch)).map((i) => ({
			name: i.ivname as string,
			addr: i.addr as number,
			ivmax: i.ivmax as number
		}));

		await db.transaction().execute(async (tx) => {
			return Promise.all([
				inverters.map(async (i) => {
					const exists = await tx
						.selectFrom('inverter')
						.select('id')
						.where('addr', '=', i.addr)
						.executeTakeFirst();

					console.log(exists);

					if (!exists) {
						return tx
							.insertInto('inverter')
							.values({ ...i, plant_id: 1 })
							.execute();
					} else {
						return tx
							.updateTable('inverter')
							.set({
								name: i.name,
								ivmax: i.ivmax
							})
							.where('addr', '=', i.addr)
							.execute();
					}
				})
			]);
		});
	},

	async getMeasurement() {
		await MeasurmentService.createMeasurement();
	}
};
