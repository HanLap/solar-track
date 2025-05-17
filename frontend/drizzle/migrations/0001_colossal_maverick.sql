ALTER TABLE "kysely_migration" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "kysely_migration_lock" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "kysely_migration" CASCADE;--> statement-breakpoint
DROP TABLE "kysely_migration_lock" CASCADE;--> statement-breakpoint
ALTER TABLE "solar_plant" RENAME COLUMN "startaddr" TO "start_addr";--> statement-breakpoint
ALTER TABLE "solar_plant" RENAME COLUMN "endaddr" TO "end_addr";--> statement-breakpoint
ALTER TABLE "measurement" DROP CONSTRAINT "measurement_inverter_id_fkey";
--> statement-breakpoint
ALTER TABLE "inverter" DROP CONSTRAINT "inverter_plant_id_fkey";
--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "measurement_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "inverter_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "pac" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "pdc" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "kdy" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "kt0" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "measurement" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "inverter" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "inverter" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "inverter_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "inverter" ALTER COLUMN "plant_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "inverter" ALTER COLUMN "addr" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "inverter" ALTER COLUMN "ivmax" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "solar_plant" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "solar_plant" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "solar_plant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "solar_plant" ALTER COLUMN "port" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "solar_plant" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "measurement" ADD CONSTRAINT "measurement_inverter_id_inverter_id_fk" FOREIGN KEY ("inverter_id") REFERENCES "public"."inverter"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inverter" ADD CONSTRAINT "inverter_plant_id_solar_plant_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."solar_plant"("id") ON DELETE no action ON UPDATE no action;