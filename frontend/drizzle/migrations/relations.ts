import { relations } from "drizzle-orm/relations";
import { solarPlant, inverter, measurement } from "./schema";

export const inverterRelations = relations(inverter, ({one, many}) => ({
	solarPlant: one(solarPlant, {
		fields: [inverter.plantId],
		references: [solarPlant.id]
	}),
	measurements: many(measurement),
}));

export const solarPlantRelations = relations(solarPlant, ({many}) => ({
	inverters: many(inverter),
}));

export const measurementRelations = relations(measurement, ({one}) => ({
	inverter: one(inverter, {
		fields: [measurement.inverterId],
		references: [inverter.id]
	}),
}));