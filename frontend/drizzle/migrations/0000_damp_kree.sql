CREATE TABLE "inverter" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer NOT NULL,
	"addr" integer NOT NULL,
	"name" text NOT NULL,
	"ivmax" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "measurement" (
	"id" serial PRIMARY KEY NOT NULL,
	"inverter_id" integer NOT NULL,
	"pac" real NOT NULL,
	"pdc" real NOT NULL,
	"kdy" real NOT NULL,
	"kt0" real NOT NULL,
	"fdat" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solar_plant" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"ip" text NOT NULL,
	"port" integer NOT NULL,
	"start_addr" integer NOT NULL,
	"end_addr" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"age" integer,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "inverter" ADD CONSTRAINT "inverter_plant_id_solar_plant_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."solar_plant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurement" ADD CONSTRAINT "measurement_inverter_id_inverter_id_fk" FOREIGN KEY ("inverter_id") REFERENCES "public"."inverter"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;