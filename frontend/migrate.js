import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { FileMigrationProvider, Kysely, Migrator, SqliteDialect } from 'kysely';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

dotenv.config();

const dbPath = process.env.DB_PATH ?? './data/data.db';
const dbDir = path.dirname(dbPath);
await fs.mkdir(dbDir, { recursive: true });

const command = process.argv[2];

const db = new Kysely({
	dialect: new SqliteDialect({
		database: new Database(dbPath),
	}),
});

const migrationFolder = path.join(process.env.PWD, '/migrations');

console.log('migrations dir:', migrationFolder);

const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		fs,
		path,
		migrationFolder,
	}),
});

let res;
if (command === 'down') {
	res = await migrator.migrateDown();
} else if (command === 'to') {
	res = await migrator.migrateTo(process.argv[3]);
} else {
	res = await migrator.migrateToLatest();
}
const { results, error } = res;

results?.forEach((it) => {
	if (it.status === 'Success') {
		console.log(`migration "${it.migrationName}" was executed successfully`);
	} else if (it.status === 'Error') {
		console.error(`failed to execute migration "${it.migrationName}"`);
	}
});

if (error) {
	console.error('failed to migrate');
	console.error(error);
	process.exit(1);
}

await db.destroy();
