import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const CreateSolarPlantSchema = zfd.formData({
	name: zfd.text(),
	description: zfd.text().optional(),
	ip: z.ipv4(),
	port: z.number().int().min(1).max(65535),
	startAddr: z.number().int().min(0).max(65535),
	endAddr: z.number().int().min(0).max(65535)
});

export type CreateSolarPlantRequest = z.infer<typeof CreateSolarPlantSchema>;
