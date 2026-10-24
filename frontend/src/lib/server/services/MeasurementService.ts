import { now } from '@internationalized/date';
import SolarApi from '../api/solarmax';
import DataService from './DataService';

export async function createMeasurement() {
	const measurement = await SolarApi.getMeasurement();

	if (measurement.length === 0) throw new Error('No measurement data');
	console.debug("received measurements:", measurement)

	try {
		const date = now('UTC');
		await DataService.saveMeasurement(measurement, date);
	} catch (error) {
		console.error('Error saving measurement to timescaledb:', error);
	}

	console.log('query suscessful');
}
