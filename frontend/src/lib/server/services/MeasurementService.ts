import * as datefnsTZ from 'date-fns-tz';
import SolarApi from '../api/solarmax';
import DataServiceKysely from './DataService';
import DataServiceDrizzle from './DataServiceDrizzle';
import { now } from '@internationalized/date';

export async function createMeasurement() {
	const date = datefnsTZ.formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss');

	const measurement = await SolarApi.getMeasurement(fetch);

	if (measurement.length === 0) throw new Error('No measurement data');

	DataServiceKysely.saveMeasurement(measurement, date);

	try {
		const date = now("UTC")
		DataServiceDrizzle.saveMeasurement(measurement, date);
	} catch (error) {
		console.error('Error saving measurement to timescaledb:', error);
	}

	console.log('query suscessful');
}
