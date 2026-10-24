import { createMeasurement } from '$lib/server/services/MeasurementService';
import { isAdminAuthenticated } from '$lib/server/util';

export async function POST({request}) {

	const token = request.headers.get("Authorization");
	if (!isAdminAuthenticated(token)) {
		new Response('unauthorized', { status: 401, statusText: 'Unauthorized' });
	}

	console.log('querying solar max');

	await createMeasurement();

	return new Response('ok');
}
