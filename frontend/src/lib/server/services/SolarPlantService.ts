import type { CreateSolarPlantRequest } from '$lib/schemas/solar-plant';
import { db } from '../db/drizzle';
import { solarPlantTble } from '../db/drizzle/schema';

async function createSolarPlant(request: CreateSolarPlantRequest) {
	return await db.insert(solarPlantTble).values(request);
}

export default {
	createSolarPlant
};
