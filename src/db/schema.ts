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
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // Added for relational queries

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

// La tabla de dimensiones ahora será una entidad propia para soportar metadatos bilingües
export const tagDimensions = pgTable("tag_dimensions", {
  id: varchar("id", { length: 50 }).primaryKey(), // e.g. 'tech', 'task', 'industry'
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  color: varchar("color", { length: 50 }), // Para la UI
  icon: varchar("icon", { length: 50 }), // Para Lucide icons
});

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
  // Mantenemos tags array como caché de lectura rápida
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

// --- Intelligent Tagging System ---

// Tabla de Etiquetas Enriquecida
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  dimensionId: varchar("dimension_id", { length: 50 })
    .references(() => tagDimensions.id, { onDelete: "cascade" })
    .notNull(),

  // Nombres Bilingües
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),

  // Descripciones para la LLM (Anclaje Semántico)
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),

  slug: varchar("slug", { length: 100 }).unique().notNull(),
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de Relación (Many-to-Many) con Borrado en Cascada
export const promptTags = pgTable(
  "prompt_tags",
  {
    promptId: uuid("prompt_id")
      .references(() => prompts.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.promptId, t.tagId] }),
  }),
);

// --- Drizzle Relations ---

export const promptTagsRelations = relations(promptTags, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptTags.promptId],
    references: [prompts.id],
  }),
  tag: one(tags, {
    fields: [promptTags.tagId],
    references: [tags.id],
  }),
}));

export const promptsRelations = relations(prompts, ({ many }) => ({
  promptTags: many(promptTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  dimension: one(tagDimensions, {
    fields: [tags.dimensionId],
    references: [tagDimensions.id],
  }),
  prompts: many(promptTags),
}));

export const tagDimensionsRelations = relations(tagDimensions, ({ many }) => ({
  tags: many(tags),
}));
