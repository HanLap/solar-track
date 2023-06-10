import type { Generated } from "kysely";


export interface InverterTable {
  id: Generated<number>;

  addr: number;

  name: string;

  ivmax: number;
}