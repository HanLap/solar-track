import { env } from '$env/dynamic/private';
import { api } from '$lib/server/api';
import type { getInvertersResponse as GetInvertersResponse, MeasurementResponse } from './Models';

const solarMaxApi = <TData>(path: string) => api<TData>(`${env.SOLARMAX_API_PATH}${path}`);

export abstract class SolarMaxApi {
	static async getInverters() {
		return await solarMaxApi<GetInvertersResponse[]>('/inverters');
	}

	static async getMeasurement() {
		return solarMaxApi<MeasurementResponse[]>('/measurement');
	}
}
