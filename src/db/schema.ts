import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  doublePrecision,
  jsonb,
  pgEnum,
  customType,
  boolean,
} from "drizzle-orm/pg-core";

// Helper para pgvector (Ajustado a 768 dimensiones para modelos como Nomic o Qwen)
const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(768)";
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

// Enums
export const promptTypeEnum = pgEnum("prompt_type", ["standard", "skill"]);
export const govTypeEnum = pgEnum("gov_type", [
  "project_rule",
  "protocol",
  "behavior",
  "tool_config",
]);

// Tabla de Prompts (Vault Knowledge)
export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: promptTypeEnum("type").default("standard").notNull(),

  // Bilingual Titles
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),

  // Bilingual Descriptions (Optimized for semantic search)
  descriptionEs: text("description_es").notNull(),
  descriptionEn: text("description_en").notNull(),

  // Content & Versioning
  content: text("content").notNull(), // Current version content
  contentEs: text("content_es"),
  contentEn: text("content_en"),
  version: integer("version").default(1).notNull(),
  versions: jsonb("versions").default([]).notNull(), // History of changes

  // Metadata
  tags: text("tags").array().default([]).notNull(),
  domain: varchar("domain", { length: 100 }),

  // RAG Vectors (768 dim for nomic-embed-text)
  embedding: vector("embedding"),

  // Tech Metadata (CLI usage)
  metadata: jsonb("metadata").default({}).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de Personas (Identidades de IA)
export const personas = pgTable("personas", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: text("role"),
  systemPrompt: text("system_prompt").notNull(),
  temperature: doublePrecision("temperature").default(0.7),
  modelPreference: varchar("model_preference", { length: 100 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de Governance (Reglas)
export const governance = pgTable("governance", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: govTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // Markdown
  fileName: varchar("file_name", { length: 255 }), // e.g. .cursorrules
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de Settings (Singleton - ID 1)
export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),

  // General
  language: text("language").default("en"),
  exportLanguage: text("export_language").default("original"),

  // Visuals
  theme: text("theme").default("system"),
  reducedMotion: boolean("reduced_motion").default(false),

  // Advanced
  notifications: boolean("notifications").default(true),
  developerMode: boolean("developer_mode").default(false),

  // Metadata for future extensibility
  metadata: jsonb("metadata").default({}).notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
