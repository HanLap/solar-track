import { createMeasurement } from '$lib/server/services/MeasurementService';

export async function POST() {
	console.log('querying solar max');
	await createMeasurement();

	return new Response('ok');
}
