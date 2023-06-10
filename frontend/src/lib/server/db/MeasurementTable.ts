import type { ColumnType, Generated } from 'kysely';

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
