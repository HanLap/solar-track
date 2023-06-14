import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db.js';

const schema = zfd.formData({
	name: zfd.text(),
	description: zfd.text().optional(),
	ip: z.string().ip({ version: 'v4' }),
	port: z.number().int().min(1).max(65535),
	startAddr: z.number().int().min(0).max(65535),
	endAddr: z.number().int().min(0).max(65535)
});

export const actions = {
	async default({ request }) {
		const res = await schema.safeParseAsync(await request.formData());

		if (!res.success) {
			return fail(400, { error: res.error });
		}

		const data = res.data;

		try {
			await db.insertInto('solar_plant').values(data).executeTakeFirstOrThrow();
		} catch (e) {
			return fail(500);
		}

		throw redirect(304, '/');
	}
};
