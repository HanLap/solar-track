import { query } from '$app/server';
import DataService from '$lib/server/services/DataService';
import { parseDate } from '@internationalized/date';
import { z } from 'zod';

const measurementSchema = z.object({
	id: z.number(),
	start: z.iso.date(),
	end: z.iso.date()
});

export const getMeasurementCount = query(
	measurementSchema,
	async ({ id, start: startStr, end: endStr }) => {
		const start = parseDate(startStr);
		const end = parseDate(endStr);

		const data = await DataService.getMeasurementCount(id, start, end);

		return data.count;
	}
);
