import type { Database } from '$lib/server/db/kysely/Database';
import { db } from '$lib/server/db/kysely/db';
import { parseDate } from '@internationalized/date';
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
		const endStr = formData.get('end') as string;
		const formatString = formData.get('format') as string;
		const format = formatString.split(',');

		const end = parseDate(endStr).add({ days: 1 }).toString();

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
			.where((eb) => eb.between('created_at', start, end))
			.groupBy('created_at')
			.execute();

		if (data.length < 0) {
			return fail(404, { noData: true });
		}

		let csv = data.map((row) => Object.values(row).join(',')).join('\n');
		csv = `${formatString}\n` + csv;

		return { csv };
	}
};
