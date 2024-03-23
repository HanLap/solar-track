import { parseDateWithFallback } from '$lib/dateUtils.js';
import SolarApi from '$lib/server/api/solarmax';
import { db } from '$lib/server/db/db';
import { getOverview } from '$lib/server/services/DataService.js';
import * as MeasurmentService from '$lib/server/services/MeasurementService';
import type { Actions } from './$types.js';

export async function load({ url: { searchParams } }) {
	const date = parseDateWithFallback(searchParams.get('day'));

	return getOverview(date);
}

export const actions: Actions = {
	async getInverters({ fetch }) {
		const inverters = (await SolarApi.getInverters(fetch)).map((i) => ({
			name: i.ivname as string,
			addr: i.addr as number,
			ivmax: i.ivmax as number,
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
								ivmax: i.ivmax,
							})
							.where('addr', '=', i.addr)
							.execute();
					}
				}),
			]);
		});
	},

	async getMeasurement() {
		await MeasurmentService.createMeasurement();
	},
};
