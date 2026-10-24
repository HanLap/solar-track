import { command, query } from '$app/server';
import { parseDateWithFallback } from '$lib/dateUtils.js';
import type { MeasurementResponse } from '$lib/server/api/solarmax/Models';
import DataService from '$lib/server/services/DataService.js';
import { isAdminAuthenticated } from '$lib/server/util';
import { now } from '@internationalized/date';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const getOverview = query(z.string().nullable(), async (day) => {
	const date = parseDateWithFallback(day);

	const [currentLoad, overview] = await Promise.all([
		DataService.getLoad(1),
		DataService.getOverview(date)
	]);
	return { currentLoad, overview };
});

export const getLoad = query(async () => {
	return DataService.getLoad(1);
});

const TokenSchema = z.object({ token: z.string().nullish() });

export const saveMeasurement = command(TokenSchema, async ({ token }) => {
	if (!isAdminAuthenticated(token)) error(401, 'Unauthorized');

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
		await DataService.saveMeasurement(measurement, date);
		console.log('measurement saved');

		getOverview(null).refresh();
	} catch (error) {
		console.error('Error saving measurement to timescaledb:', error);
	}
});
