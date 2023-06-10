import { Kysely, SqliteDialect } from 'kysely';
import type { Database as DatabaseModel } from './Database';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

export const db = new Kysely<DatabaseModel>({
	// Use MysqlDialect for MySQL and SqliteDialect for SQLite.
	dialect: new SqliteDialect({ database: new Database(env.DB_PATH) })
});
