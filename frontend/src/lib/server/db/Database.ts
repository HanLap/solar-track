import type { InverterTable } from "./InverterTable";
import type { MeasurementTable } from "./MeasurementTable";

export interface Database {
  inverter: InverterTable;
  measurement: MeasurementTable;
}