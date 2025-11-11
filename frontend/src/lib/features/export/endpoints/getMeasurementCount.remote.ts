import { query } from '$app/server';
import { db } from '$lib/server/db/kysely/db';
import { DB_USE_DRIZZLE } from '$lib/server/flags';
import DataService from '$lib/server/services/DataServiceDrizzle';
import { parseDate } from '@internationalized/date';
import * as datefns from 'date-fns';
import { sql } from 'kysely';
import { z } from 'zod';

const measurementSchema = z.object({
	id: z.number(),
	start: z.iso.date(),
	end: z.iso.date()
});

export const getMeasurementCount = query(
	measurementSchema,
	async ({ id, start: startStr, end: endStr }) => {
		if (DB_USE_DRIZZLE) {
			const start = parseDate(startStr);
			const end = parseDate(endStr);

			const data = await DataService.getMeasurementCount(id, start, end);

			return data.count;
		}

		const end = datefns.format(datefns.addDays(new Date(endStr), 1), 'yyyy-MM-dd');

		const data = await db
			.selectFrom('measurement')
			.select([sql<number>`count(1)`.as('count')])
			.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
			.where('inverter.plant_id', '=', id)
			.where(sql<boolean>`created_at between ${startStr} and ${end}`)
			.executeTakeFirstOrThrow();

		return data.count;
	}
);
