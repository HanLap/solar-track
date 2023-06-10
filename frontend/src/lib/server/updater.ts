import { CronJob } from 'cron';
import { createMeasurement } from './services/MeasurementService';

export const job = () =>
	new CronJob(
		'*/20 * * * * *',
		function () {
			console.log('querying solar max');
			createMeasurement();
		},
		null,
		false,
		'Europe/Berlin'
	);
