import { env } from '$env/dynamic/private';
import { parseDateWithFallback } from '$lib/dateUtils.js';
import DataServiceKysely from '$lib/server/services/DataService.js';
import DataServiceDrizzle from '$lib/server/services/DataServiceDrizzle.js';

export async function load({ url: { searchParams } }) {
	const date = parseDateWithFallback(searchParams.get('day'));

	if (env.DB_USE_DRIZZLE === 'true') {
		return DataServiceDrizzle.getOverview(date);
	}

	return DataServiceKysely.getOverview(date);
}
