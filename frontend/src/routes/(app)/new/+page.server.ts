import { CreateSolarPlantSchema } from '$lib/schemas/solar-plant';
import { db } from '$lib/server/db/kysely/db';
import { DB_USE_DRIZZLE } from '$lib/server/flags';
import SolarPlantService from '$lib/server/services/SolarPlantService';
import { formAction } from '$lib/server/util.js';
import { fail, redirect } from '@sveltejs/kit';

const createSolarPlantAction = formAction({
	schema: CreateSolarPlantSchema,
	async handler({ json }) {
		try {
			if (DB_USE_DRIZZLE) {
				await SolarPlantService.createSolarPlant(json);
			} else {
				await db.insertInto('solar_plant').values(json).executeTakeFirstOrThrow();
			}
		} catch (e) {
			console.error(e);
			return fail(500);
		}

		redirect(304, '/');
	}
});

export const actions = {
	default: createSolarPlantAction
};
