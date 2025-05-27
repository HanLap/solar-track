import { db } from '$lib/server/db/kysely/db';
import { DB_USE_DRIZZLE } from '$lib/server/flags';
import DataService from '$lib/server/services/DataServiceDrizzle';
import { parseDate } from '@internationalized/date';
import { error, json } from '@sveltejs/kit';
import * as datefns from 'date-fns';
import { sql } from 'kysely';

export async function GET({ url, params }) {
	const id = parseInt(params.id);
	const startStr = url.searchParams.get('start');
	const endStr = url.searchParams.get('end');

	if (isNaN(id) || !startStr || !endStr) {
		error(400, 'id, start and end are required');
	}

	if (DB_USE_DRIZZLE) {
		const start = parseDate(startStr);
		const end = parseDate(endStr);

		const data = await DataService.getMeasurementCount(id, start, end);

		return json(data);
	}

	const end = datefns.format(datefns.addDays(new Date(endStr), 1), 'yyyy-MM-dd');

	const data = await db
		.selectFrom('measurement')
		.select([sql<number>`count(1)`.as('count')])
		.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
		.where('inverter.plant_id', '=', id)
		.where(sql<boolean>`created_at between ${startStr} and ${end}`)
		.executeTakeFirstOrThrow();

	return json(data);
}
