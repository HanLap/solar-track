import { sql } from 'kysely';

/**
 * @param {import('kysely').Kysely<import('../src/lib/server/db/Database').Database>} db
 */
export async function up(db) {
	await db.schema
		.createTable('solar_plant')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('name', 'varchar', (column) => column.notNull())
		.addColumn('description', 'varchar')
		.addColumn('ip', 'varchar', (column) => column.notNull())
		.addColumn('port', 'integer', (column) => column.notNull())
		.addColumn('startAddr', 'integer', (column) => column.notNull())
		.addColumn('endAddr', 'integer', (column) => column.notNull())
		.addColumn('created_at', 'datetime', (column) =>
			column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	await db
		.insertInto('solar_plant')
		.values({
			name: 'Solar Plant 1',
			ip: '192.168.178.123',
			port: 12345,
			startAddr: 9,
			endAddr: 10,
		})
		.execute();

	await db.schema
		.alterTable('inverter')
		.addColumn('plant_id', 'integer', (col) => col.references('solar_plant.id'))
		.execute();

	await db
		.updateTable('inverter')
		.set({ plant_id: sql`(select id from solar_plant)` })
		.execute();
	console.log('blub');

	await db.schema
		.createTable('inverter_tmp')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('plant_id', 'integer', (col) =>
			col.notNull().references('solar_plant.id').onDelete('cascade'),
		)
		.addColumn('addr', 'integer', (column) => column.notNull())
		.addColumn('name', 'varchar', (column) => column.notNull())
		.addColumn('ivmax', 'integer', (column) => column.notNull())
		.execute();
	{
		const values = await db.selectFrom('inverter').selectAll().execute();

		if (values.length > 0) {
			await db.insertInto('inverter_tmp').values(values).execute();
		}
	}

	await db.schema
		.createTable('measurement_tmp')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('inverter_id', 'integer', (column) => column.notNull())
		.addColumn('pac', 'decimal', (column) => column.notNull())
		.addColumn('pdc', 'decimal', (column) => column.notNull())
		.addColumn('kdy', 'decimal', (column) => column.notNull())
		.addColumn('kt0', 'decimal', (column) => column.notNull())
		.addColumn('fdat', 'datetime', (column) => column.notNull())
		.addColumn('created_at', 'datetime', (column) =>
			column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	await sql`insert into measurement_tmp (inverter_id, pac, pdc, kdy, kt0, fdat, created_at) select inverter_id, pac, pdc, kdy, kt0, fdat, created_at from measurement`.execute(
		db,
	);

	await db.schema.dropTable('inverter').execute();
	await db.schema.alterTable('inverter_tmp').renameTo('inverter').execute();

	await sql`insert into measurement (inverter_id, pac, pdc, kdy, kt0, fdat, created_at) select inverter_id, pac, pdc, kdy, kt0, fdat, created_at from measurement_tmp`.execute(
		db,
	);
	await db.schema.dropTable('measurement_tmp').execute();
}

/**
 * @param {import('kysely').Kysely<import('../src/lib/server/db/Database').Database>} db
 */
export async function down(db) {
	await db.schema
		.createTable('inverter_tmp')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('addr', 'integer', (column) => column.notNull())
		.addColumn('name', 'varchar', (column) => column.notNull())
		.addColumn('ivmax', 'integer', (column) => column.notNull())
		.execute();

	await db
		.insertInto('inverter_tmp')
		.values(await db.selectFrom('inverter').select(['id', 'addr', 'ivmax', 'name']).execute())
		.execute();

	await db.schema
		.createTable('measurement_tmp')
		.addColumn('id', 'integer', (column) => column.primaryKey())
		.addColumn('inverter_id', 'integer', (column) => column.notNull())
		.addColumn('pac', 'decimal', (column) => column.notNull())
		.addColumn('pdc', 'decimal', (column) => column.notNull())
		.addColumn('kdy', 'decimal', (column) => column.notNull())
		.addColumn('kt0', 'decimal', (column) => column.notNull())
		.addColumn('fdat', 'datetime', (column) => column.notNull())
		.addColumn('created_at', 'datetime', (column) =>
			column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();
	await sql`insert into measurement_tmp (inverter_id, pac, pdc, kdy, kt0, fdat, created_at) select inverter_id, pac, pdc, kdy, kt0, fdat, created_at from measurement`.execute(
		db,
	);

	await db.schema.dropTable('inverter').execute();
	await db.schema.alterTable('inverter_tmp').renameTo('inverter').execute();

	await sql`insert into measurement (inverter_id, pac, pdc, kdy, kt0, fdat, created_at) select inverter_id, pac, pdc, kdy, kt0, fdat, created_at from measurement_tmp`.execute(
		db,
	);
	await db.schema.dropTable('measurement_tmp').execute();

	await db.schema.dropTable('solar_plant').execute();
}
