import { parseDateWithFallback } from '$lib/dateUtils.js';
import type { MeasurementResponse } from '$lib/server/api/solarmax/Models.js';
import { DB_USE_DRIZZLE } from '$lib/server/flags';
import DataServiceKysely from '$lib/server/services/DataService.js';
import DataServiceDrizzle from '$lib/server/services/DataServiceDrizzle.js';
import { now } from '@internationalized/date';

export async function load({ url: { searchParams } }) {
	const date = parseDateWithFallback(searchParams.get('day'));

	if (DB_USE_DRIZZLE) {
		return DataServiceDrizzle.getOverview(date);
	}

	return DataServiceKysely.getOverview(date);
}

export const actions = {
	saveMeasurement: async () => {
		const date = now('UTC');

		const measurement: MeasurementResponse[] = [
			{
				addr: 10,
				pac: 500,
				pdc: 300,
				kdy: 5050,
				kt0: 500000000,
				fdat: '2025-05-17T07:56:35Z'
			}
		];
		try {
			await DataServiceDrizzle.saveMeasurement(measurement, date);
			console.log('measurement saved');
		} catch (error) {
			console.error('Error saving measurement to timescaledb:', error);
		}
	}
};
