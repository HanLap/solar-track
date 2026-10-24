import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const CreateSolarPlantSchema = zfd.formData({
	name: zfd.text(),
	description: zfd.text().optional(),
	ip: zfd.text(),
	port: zfd.numeric(z.number().int().min(1).max(65535)),
	startAddr: zfd.numeric(z.number().int().min(0).max(65535)),
	endAddr: zfd.numeric(z.number().int().min(0).max(65535))
});

export type CreateSolarPlantRequest = z.infer<typeof CreateSolarPlantSchema>;
