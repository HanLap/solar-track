import { pgTable, text, bigint, foreignKey, numeric, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const kyselyMigration = pgTable("kysely_migration", {
	name: text().primaryKey().notNull(),
	timestamp: text(),
});

export const kyselyMigrationLock = pgTable("kysely_migration_lock", {
	id: text().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	isLocked: bigint("is_locked", { mode: "number" }).default(sql`'0'`),
});

export const inverter = pgTable("inverter", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	plantId: bigint("plant_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	addr: bigint({ mode: "number" }),
	name: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ivmax: bigint({ mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [solarPlant.id],
			name: "inverter_plant_id_fkey"
		}).onDelete("cascade"),
]);

export const measurement = pgTable("measurement", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inverterId: bigint("inverter_id", { mode: "number" }),
	pac: numeric(),
	pdc: numeric(),
	kdy: numeric(),
	kt0: numeric(),
	fdat: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.inverterId],
			foreignColumns: [inverter.id],
			name: "measurement_inverter_id_fkey"
		}).onDelete("cascade"),
]);

export const solarPlant = pgTable("solar_plant", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
	description: text(),
	ip: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	port: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startaddr: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	endaddr: bigint({ mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
