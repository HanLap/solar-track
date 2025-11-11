import { command, query } from '$app/server';
import { parseDateWithFallback } from '$lib/dateUtils.js';
import type { MeasurementResponse } from '$lib/server/api/solarmax/Models';
import { DB_USE_DRIZZLE } from '$lib/server/flags';
import DataServiceKysely from '$lib/server/services/DataService.js';
import DataServiceDrizzle from '$lib/server/services/DataServiceDrizzle.js';
import { now } from '@internationalized/date';
import { z } from 'zod';

export const getOverview = query(z.string().nullable(), async (day) => {
	const date = parseDateWithFallback(day);

	if (DB_USE_DRIZZLE) {
		const [currentLoad, overview] = await Promise.all([
			DataServiceDrizzle.getLoad(1),
			DataServiceDrizzle.getOverview(date),
		]);
		return { currentLoad, overview };
	}

	const [currentLoad, overview] = await Promise.all([
		DataServiceKysely.getLoad(1),
		DataServiceKysely.getOverview(date)
	]);

	return { currentLoad, overview };
});

export const getLoad = query(async () => {
	if (DB_USE_DRIZZLE) {
		return DataServiceDrizzle.getLoad(1);
	}

	return DataServiceKysely.getLoad(1);
});

export const saveMeasurement = command(async () => {
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

		getOverview(null).refresh();
	} catch (error) {
		console.error('Error saving measurement to timescaledb:', error);
	}
});
