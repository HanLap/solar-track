import { db } from '$lib/server/db/db';
import { error, json } from '@sveltejs/kit';
import { sql } from 'kysely';

export async function GET({ url, params }) {
	const id = parseInt(params.id);
	const startStr = url.searchParams.get('start');
	const endStr = url.searchParams.get('end');

	if (isNaN(id) || !startStr || !endStr) {
		throw error(400, 'id, start and end are required');
	}

	const data = await db
		.selectFrom('measurement')
		.select([sql<number>`count(1)`.as('count')])
		.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
		.where('inverter.plant_id', '=', id)
		.where(sql`created_at between ${startStr} and ${endStr}`)
		.executeTakeFirstOrThrow();

	return json(data);
}
