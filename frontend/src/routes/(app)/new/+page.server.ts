import { CreateSolarPlantSchema } from '$lib/models/solar-plant';
import SolarPlantService from '$lib/server/services/SolarPlantService';
import { formAction } from '$lib/server/util.js';
import { fail, redirect } from '@sveltejs/kit';

const createSolarPlantAction = formAction({
	schema: CreateSolarPlantSchema,
	async handler({ json }) {
		try {
			await SolarPlantService.createSolarPlant(json);
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
