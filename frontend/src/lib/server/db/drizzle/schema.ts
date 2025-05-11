import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const sessionsTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Solar Plant Schema

export const solarPlantTble = pgTable('solar_plant', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	ip: text('ip').notNull(),
	port: integer('port').notNull(),
	startAddr: integer('start_addr').notNull(),
	endAddr: integer('end_addr').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

export const inverterTable = pgTable('inverter', {
	id: serial('id').primaryKey(),
	plantId: integer('plant_id')
		.notNull()
		.references(() => solarPlantTble.id),
	addr: integer('addr').notNull(),
	name: text('name').notNull(),
	ivmax: integer('ivmax').notNull()
});

export const measurementTable = pgTable('measurement', {
	id: serial('id').primaryKey(),
	inverterId: integer('inverter_id')
		.notNull()
		.references(() => inverterTable.id),
	pac: real('pac').notNull(),
	pdc: real('pdc').notNull(),
	kdy: real('kdy').notNull(),
	kt0: real('kt0').notNull(),
	fdat: timestamp('fdat', { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

export type Session = typeof sessionsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;

export type SolarPlant = typeof solarPlantTble.$inferSelect;
export type Inverter = typeof inverterTable.$inferSelect;
export type Measurement = typeof measurementTable.$inferSelect;
