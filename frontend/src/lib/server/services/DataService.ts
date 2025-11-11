import type { CalendarDate, ZonedDateTime } from '@internationalized/date';
import { and, asc, between, desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import type { MeasurementResponse } from '../api/solarmax/Models';
import { db } from '../db/drizzle';
import { inverterTable, measurementTable, type Inverter } from '../db/drizzle/schema';

type InverterLine = {
	name: string;
	data: { x: string; y: number }[];
};

export type ExportFormat = 'date' | 'pac' | 'pdc' | 'kdy' | 'kt0';

export default abstract class DataService {
	static async getOverview(date: CalendarDate) {
		const inverters = await db
			.select({ ...getTableColumns(inverterTable), plant_id: inverterTable.plantId })
			.from(inverterTable)
			.execute();

		const inverterLines = inverters.map((i) => this.getInverterLine(i, date));
		const combinedLineData = this.getCombinedInverterLine(date);

		const lines = [combinedLineData, ...inverterLines];

		const ivmax = Math.ceil(inverters.reduce((acc, i) => acc + i.ivmax, 0) / 1000) * 1000 - 2000;

		return {
			inverters,
			ivmax,
			day: date.toString(),
			lines: await Promise.all(lines)
		};
	}

	static async getInverterLine(inverter: Inverter, date: CalendarDate): Promise<InverterLine> {
		const data = await db
			.select({ x: measurementTable.createdAt, y: measurementTable.pac })
			.from(measurementTable)
			.where(
				and(
					eq(measurementTable.inverterId, inverter.id),
					between(measurementTable.createdAt, date.toString(), date.add({ days: 1 }).toString())
				)
			)
			.orderBy(asc(measurementTable.createdAt))
			.execute();

		return { name: inverter.name, data };
	}

	static async getCombinedInverterLine(date: CalendarDate): Promise<InverterLine> {
		const data = await db
			.select({ x: measurementTable.createdAt, y: sql<number>`sum(${measurementTable.pac})` })
			.from(measurementTable)
			.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
			.where(
				and(
					eq(inverterTable.plantId, 1),
					between(measurementTable.createdAt, date.toString(), date.add({ days: 1 }).toString())
				)
			)
			.groupBy(measurementTable.createdAt)
			.orderBy(asc(measurementTable.createdAt))
			.execute();

		return { name: 'Gesamt', data };
	}

	static async getLoad(plantId: number) {
		return (
			(
				await db
					.select({ sum: sql<number>`sum(${measurementTable.pac})` })
					.from(measurementTable)
					.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
					.where(eq(inverterTable.plantId, plantId))
					.groupBy(measurementTable.createdAt)
					.orderBy(desc(measurementTable.createdAt))
					.execute()
			)[0]?.sum ?? undefined
		);
	}

	static async getMeasurementCount(plantId: number, start: CalendarDate, end: CalendarDate) {
		return (
			await db
				.select({ count: sql<number>`count(1)` })
				.from(measurementTable)
				.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
				.where(
					and(
						eq(inverterTable.plantId, plantId),
						between(measurementTable.createdAt, start.toString(), end.add({ days: 1 }).toString())
					)
				)
				.execute()
		)[0];
	}

	static async saveMeasurement(measurement: MeasurementResponse[], date: ZonedDateTime) {
		const inverters = await db.query.inverterTable.findMany({
			where: inArray(
				inverterTable.addr,
				measurement.map((m) => m.addr)
			)
		});

		const data = measurement.map((m) => {
			const inverterId = inverters.find((i) => i.addr === m.addr)?.id;

			if (!inverterId) throw new Error('Inverter not found');

			return {
				inverterId,
				fdat: new Date(m.fdat).toISOString(),
				pac: m.pac,
				pdc: m.pdc,
				kdy: m.kdy,
				kt0: m.kt0,
				createdAt: date.toAbsoluteString()
			} satisfies typeof measurementTable.$inferInsert;
		});

		await db.insert(measurementTable).values(data);
	}

	static async exportMeasurements(format: ExportFormat[], start: string, end: string) {
		const select = this.parseSelectFormat(format);

		return await db
			.select(select)
			.from(measurementTable)
			.innerJoin(inverterTable, eq(inverterTable.id, measurementTable.inverterId))
			.where(
				and(
					eq(inverterTable.plantId, 1),
					between(measurementTable.createdAt, start.toString(), end.toString())
				)
			)
			.groupBy(measurementTable.createdAt)
			.execute();
	}

	private static parseSelectFormat(format: ExportFormat[]) {
		return format.reduce((acc, f) => {
			switch (f) {
				case 'date':
					return { ...acc, createdAt: measurementTable.createdAt };
				case 'pac':
					return { ...acc, pac: sql<number>`sum(${measurementTable.pac})` };
				case 'pdc':
					return { ...acc, pdc: sql<number>`sum(${measurementTable.pdc})` };
				case 'kdy':
					return { ...acc, kdy: sql<number>`sum(${measurementTable.kdy})` };
				case 'kt0':
					return { ...acc, kt0: sql<number>`sum(${measurementTable.kt0})` };
			}
		}, {});
	}
}
