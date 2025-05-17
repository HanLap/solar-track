-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/* */
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inverter" (
	"id" bigint PRIMARY KEY NOT NULL,
	"plant_id" bigint,
	"addr" bigint,
	"name" text,
	"ivmax" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "measurement" (
	"id" bigint PRIMARY KEY NOT NULL,
	"inverter_id" bigint,
	"pac" numeric,
	"pdc" numeric,
	"kdy" numeric,
	"kt0" numeric,
	"fdat" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solar_plant" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"ip" text,
	"port" bigint,
	"startaddr" bigint,
	"endaddr" bigint,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "inverter" DROP CONSTRAINT IF EXISTS "inverter_plant_id_fkey";
ALTER TABLE "inverter" ADD CONSTRAINT "inverter_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "public"."solar_plant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

ALTER TABLE "measurement" DROP CONSTRAINT IF EXISTS "measurement_inverter_id_fkey";
ALTER TABLE "measurement" ADD CONSTRAINT "measurement_inverter_id_fkey" FOREIGN KEY ("inverter_id") REFERENCES "public"."inverter"("id") ON DELETE cascade ON UPDATE no action;