import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function runMigration() {
	console.log('Migration started ⌛');

	const dbUrl = process.env.DATABASE_URL as string;

	if (!dbUrl) throw new Error('No database url found');

	const client = postgres(dbUrl, {
		max: 1
	});

	const db = drizzle(client);
	try {
		await migrate(db, { migrationsFolder: './drizzle/migrations' });
		console.log('Migration completed ✅');
	} finally {
		await client.end();
	}
}

try {
	await runMigration();
} catch (error) {
	console.error('Migration failed 🚨:', error);
	process.exit(1);
}
