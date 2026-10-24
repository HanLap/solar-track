import { CreateSolarPlantSchema } from '$lib/models/solar-plant';
import SolarPlantService from '$lib/server/services/SolarPlantService';
import { formAction, isAdminAuthenticated } from '$lib/server/util.js';
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';
import { zfd } from 'zod-form-data';

const RequestSchema = z.intersection(
	zfd.formData({ token: zfd.text().nullish() }),
	CreateSolarPlantSchema
);

const createSolarPlantAction = formAction({
	schema: RequestSchema,
	async handler({ json }) {
		const { token, ...request } = json;

		if (!isAdminAuthenticated(token)) return fail(401, { error: { fieldErrors: 'Unauthorized' } });

		try {
			await SolarPlantService.createSolarPlant(request);
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
