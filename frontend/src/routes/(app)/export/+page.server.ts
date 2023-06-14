import type { Database } from '$lib/server/db/Database';
import { db } from '$lib/server/db/db';
import { fail } from '@sveltejs/kit';
import { sql, type SelectExpression } from 'kysely';
import type { Actions } from './$types';

export async function load() {
	return {};
}

export const actions: Actions = {
	async default({ request }) {
		const formData = await request.formData();
		const start = formData.get('start') as string;
		const end = formData.get('end') as string;
		const formatString = formData.get('format') as string;
		const format = formatString.split(',');

		for (const f of format) {
			if (!['date', 'pac', 'pdc', 'kdy', 'kt0'].includes(f)) {
				return fail(400, { format: f });
			}
		}

		const select = format.map((f) => {
			switch (f) {
				case 'date':
					return 'created_at';
				case 'pac':
					return sql<number>`sum(pac)`.as('pac');
				case 'pdc':
					return sql<number>`sum(pdc)`.as('pdc');
				case 'kdy':
					return sql<number>`sum(kdy)`.as('kdy');
				case 'kt0':
					return sql<number>`sum(kt0)`.as('kt0');
				default:
					return f;
			}
		}) as SelectExpression<Database, 'measurement'>[];

		const data = await db
			.selectFrom('measurement')
			.select(select)
			.innerJoin('inverter', 'inverter.id', 'measurement.inverter_id')
			.where('inverter.plant_id', '=', 1)
			.where(sql`created_at between ${start} and ${end}`)
			.groupBy('created_at')
			.execute();

		if (data.length < 0) {
			return fail(404, { noData: true });
		}

		const csv = data.map((row) => Object.values(row).join(',')).join('\n');

		return { csv };
	}
};
