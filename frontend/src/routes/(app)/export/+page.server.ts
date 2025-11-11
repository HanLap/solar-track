import { exportRequestSchema } from '$lib/schemas/export-request';
import { DB_USE_DRIZZLE } from '$lib/server/flags';
import DataServiceKysely from '$lib/server/services/DataService';
import DataServiceDrizzle from '$lib/server/services/DataServiceDrizzle';
import { formAction } from '$lib/server/util';
import { parseDate } from '@internationalized/date';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const exportCsvAction = formAction({
	schema: exportRequestSchema,
	async handler({ json }) {
		const { start, format, end: endStr } = json;

		const end = parseDate(endStr).add({ days: 1 }).toString();

		let data = [];
		if (DB_USE_DRIZZLE) {
			data = await DataServiceDrizzle.exportMeasurements(format, start, end);
		} else {
			data = await DataServiceKysely.exportMeasurements(format, start, end);
		}

		if (data.length < 0) {
			return fail(404, { noData: true });
		}

		let csv = data.map((row) => Object.values(row).join(',')).join('\n');
		csv = `${format.join(',')}\n` + csv;

		return { csv };
	}
});

export const actions: Actions = {
	default: exportCsvAction
};
