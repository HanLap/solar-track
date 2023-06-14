import { sql } from 'kysely';

/**
 * @param {import('kysely').Kysely<import('../src/lib/server/db/Database').Database>} db
 */
export async function up(db) {
	await db.schema
		.createTable('inverter')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('addr', 'integer', (column) => column.notNull())
		.addColumn('name', 'varchar', (column) => column.notNull())
		.addColumn('ivmax', 'integer', (column) => column.notNull())
		.execute()

	await db.schema
		.createTable('measurement')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('inverter_id', 'integer', (column) =>
			column.notNull().references('inverter.id').onDelete('cascade')
		)
		.addColumn('pac', 'decimal', (column) => column.notNull())
		.addColumn('pdc', 'decimal', (column) => column.notNull())
		.addColumn('kdy', 'decimal', (column) => column.notNull())
		.addColumn('kt0', 'decimal', (column) => column.notNull())
		.addColumn('fdat', 'datetime', (column) => column.notNull())
		.addColumn('created_at', 'datetime', (column) => column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.execute();
}

/**
 * @param {import('kysely').Kysely<import('../src/lib/server/db/Database').Database>} db
 */
export async function down(db) {
	await db.schema.dropTable('inverter').execute();
	await db.schema.dropTable('measurement').execute();
}
