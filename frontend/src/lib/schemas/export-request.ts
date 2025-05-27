import z from 'zod';
import { zfd } from 'zod-form-data';

const formatEnumSchema = z.enum(['date', 'pac', 'pdc', 'kdy', 'kt0'], {
	required_error: 'Format is required'
});

export const exportRequestSchema = zfd.formData({
	start: z.string().min(1, { message: 'Start date is required' }),
	end: z.string().min(1, { message: 'End date is required' }),
	format: formatEnumSchema.array().min(1, { message: 'At least one format is required' })
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;
