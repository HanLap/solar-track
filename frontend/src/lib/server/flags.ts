import { env } from '$env/dynamic/private';

export const DB_USE_DRIZZLE = env.DB_USE_DRIZZLE === 'true';
