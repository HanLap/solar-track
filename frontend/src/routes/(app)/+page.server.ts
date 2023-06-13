import SolarApi from '$lib/server/api/solarmax';
import { db } from '$lib/server/db/db';
import * as MeasurmentService from '$lib/server/services/MeasurementService';
import * as datefns from 'date-fns';
import { sql } from 'kysely';

export async function load({ url }) {
	const dayString = url.searchParams.get('day');
	const day = dayString ? datefns.parse(dayString, 'yyyy-MM-dd', new Date()) : new Date();

	const inverters = await db.selectFrom('inverter').selectAll().execute();

	const lines = inverters.map(async (i) => {
		const data = (await db
			.selectFrom('measurement')
			.select(['created_at as x', 'pac as y'])
			.where('inverter_id', '=', i.id)
			.where(
				sql`created_at between ${datefns.format(
					datefns.addDays(day, -1),
					'yyyy-MM-dd'
				)} and ${datefns.format(datefns.addDays(day, 1), 'yyyy-MM-dd')}`
			)
			.execute())
			.map(({x, y}) => ({x: x + 'Z', y}));

		return {
			name: i.name,
			data
		};
	});

	const ivmax = Math.max(...inverters.map((i) => i.ivmax));

	return {
		inverters,
		ivmax,
		day: datefns.format(day, 'yyyy-MM-dd'),
		lines: Promise.all(lines),
	};
}

export const actions = {
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
						return tx.insertInto('inverter').values(i).execute();
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
