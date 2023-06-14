import type { ColumnType, Generated } from 'kysely';

export interface SolarPlantTable {
	id: Generated<number>;
	name: string;
	description?: string;
	ip: string;
	port: number;
	startAddr: number;
	endAddr: number;
	created_at: ColumnType<string, string | undefined, never>;
}

export interface InverterTable {
	id: Generated<number>;
	plant_id: number;
	addr: number;
	name: string;
	ivmax: number;
}

export interface MeasurementTable {
	id: Generated<number>;
	inverter_id: number;
	pac: number;
	pdc: number;
	kdy: number;
	kt0: number;
	fdat: ColumnType<string, string | undefined, never>;
	created_at: ColumnType<string, string | undefined, never>;
}

export interface Database {
	solar_plant: SolarPlantTable;
	inverter: InverterTable;
	measurement: MeasurementTable;
}
