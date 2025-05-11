import { env } from '$env/dynamic/private';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Database as DatabaseModel } from './Database';

const dbPath = process.env.DB_PATH ?? './data/data.db';
const dbDir = path.dirname(dbPath);
await fs.mkdir(dbDir, { recursive: true });

export const db = new Kysely<DatabaseModel>({
	// Use MysqlDialect for MySQL and SqliteDialect for SQLite.
	dialect: new SqliteDialect({ database: new Database(env.DB_PATH ?? './data/data.db') })
});
