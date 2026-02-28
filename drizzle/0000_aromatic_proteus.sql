CREATE TYPE "public"."prompt_type" AS ENUM('standard', 'skill');--> statement-breakpoint
CREATE TABLE "prompt_tags" (
	"prompt_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "prompt_tags_prompt_id_tag_id_pk" PRIMARY KEY("prompt_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "prompt_type" DEFAULT 'standard' NOT NULL,
	"title_es" text NOT NULL,
	"title_en" text NOT NULL,
	"description_es" text NOT NULL,
	"description_en" text NOT NULL,
	"content" text NOT NULL,
	"content_es" text,
	"content_en" text,
	"version" integer DEFAULT 1 NOT NULL,
	"versions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"domain" varchar(100),
	"embedding" vector(768),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"language" text DEFAULT 'en',
	"export_language" text DEFAULT 'original',
	"theme" text DEFAULT 'system',
	"reduced_motion" boolean DEFAULT false,
	"notifications" boolean DEFAULT true,
	"developer_mode" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_dimensions" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_es" text NOT NULL,
	"description_en" text,
	"description_es" text,
	"color" varchar(50),
	"icon" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dimension_id" varchar(50) NOT NULL,
	"name_en" text NOT NULL,
	"name_es" text NOT NULL,
	"description_en" text,
	"description_es" text,
	"slug" varchar(100) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_dimension_id_tag_dimensions_id_fk" FOREIGN KEY ("dimension_id") REFERENCES "public"."tag_dimensions"("id") ON DELETE cascade ON UPDATE no action;