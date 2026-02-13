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
} from "drizzle-orm/pg-core";

// Helper para pgvector (Ajustado a 768 dimensiones para modelos como Nomic o Qwen)
const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(768)";
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

// Tabla de Prompts & Skills
export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: promptTypeEnum("type").default("standard").notNull(),
  title: text("title").notNull(),
  domain: varchar("domain", { length: 100 }),
  promptEs: text("prompt_es").notNull(),
  promptEn: text("prompt_en").notNull(),
  embedding: vector("embedding"),
  // Aquí guardamos CLI_Prefix, Input_Schema y metadata de Claude Code
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
