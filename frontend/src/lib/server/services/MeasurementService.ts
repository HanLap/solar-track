import SolarApi from '../api/solarmax';
import { db } from '../db/db';

export async function createMeasurement() {
	const measurement = await SolarApi.getMeasurement(fetch);

	if (measurement.length === 0) throw new Error('No measurement data');

	const ids = await db
		.selectFrom('inverter')
		.select(['id', 'addr'])
		.where(
			'addr',
			'in',
			measurement.map((m) => m.addr)
		)
		.execute();

	await db
		.insertInto('measurement')
		.values(
			measurement.map((m) => {
				const inverter_id = ids.find((i) => i.addr === m.addr)?.id;

				if (!inverter_id) throw new Error('Inverter not found');

				return {
					inverter_id,
					fdat: new Date(m.fdat).toISOString(),
					pac: m.pac,
					pdc: m.pdc,
					kdy: m.kdy,
					kt0: m.kt0
				};
			})
		)
		.execute();
}
