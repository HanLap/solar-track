import { env } from '$env/dynamic/private';
import type { MeasurementResponse, getInvertersResponse as GetInvertersResponse } from './Models';

async function get(fetchFn: typeof fetch, path: string) {
	const response = await fetchFn(`${env.API_PATH}${path}`);

	return await response.json();
}

async function getInverters(fetchFn: typeof fetch) {
	return (await get(fetchFn, '/inverters')) as GetInvertersResponse[];
}

async function getMeasurement(fetchFn: typeof fetch) {
	return (await get(fetchFn, '/measurement')) as MeasurementResponse[];
}

export default { getInverters, getMeasurement };
