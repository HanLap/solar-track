import { exportRequestSchema } from '$lib/schemas/export-request';
import DataService from '$lib/server/services/DataService';
import { formAction } from '$lib/server/util';
import { parseDate } from '@internationalized/date';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const exportCsvAction = formAction({
	schema: exportRequestSchema,
	async handler({ json }) {
		const { start, format, end: endStr } = json;

		const end = parseDate(endStr).add({ days: 1 }).toString();

		const data = await DataService.exportMeasurements(format, start, end);

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
