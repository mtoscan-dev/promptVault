"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema";
import { generateEmbedding } from "@/lib/vectorize";
import { Prompt } from "@/types";
import { cosineDistance, desc, eq, sql, and, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function searchPrompts(query: string, domain?: string) {
  try {
    const filters = [];

    // Default to standard if no domain is provided, but if domain is provided, rely on it
    if (!domain) {
      filters.push(eq(prompts.type, "standard"));
    } else {
      // Support "logic:*" wildcard-like behavior or specific "logic:claude"
      // If domain ends with ':', treat as prefix search
      if (domain.endsWith(":")) {
        filters.push(sql`${prompts.domain} LIKE ${domain + "%"}`);
      } else {
        filters.push(eq(prompts.domain, domain));
      }
    }

    if (!query) {
      // Return sorted by date
      const results = await db
        .select()
        .from(prompts)
        .where(and(...filters))
        .orderBy(desc(prompts.createdAt))
        .limit(50);

      return mapDbPromptsToType(results);
    }
    // Semantic Search
    const queryEmbedding = await generateEmbedding(query);
    const similarity = sql<number>`1 - (${cosineDistance(prompts.embedding, queryEmbedding)})`;

    const results = await db
      .select({
        id: prompts.id,
        titleEs: prompts.titleEs,
        titleEn: prompts.titleEn,
        descriptionEs: prompts.descriptionEs,
        descriptionEn: prompts.descriptionEn,
        content: prompts.content,
        tags: prompts.tags,
        domain: prompts.domain,
        version: prompts.version,
        versions: prompts.versions,
        createdAt: prompts.createdAt,
        updatedAt: prompts.updatedAt,
        metadata: prompts.metadata,
        similarity,
      })
      .from(prompts)
      .where(
        and(
          ...filters,
          lt(cosineDistance(prompts.embedding, queryEmbedding), 0.5), // Similarity > 0.5
        ),
      )
      .orderBy(desc(similarity))
      .limit(20);

    return mapDbPromptsToType(results);
  } catch (error) {
    console.error("❌ Search failed:", error);
    return [];
  }
}

export async function savePrompt(data: {
  id?: string;
  titleEs?: string | null;
  titleEn?: string | null;
  descriptionEs?: string | null;
  descriptionEn?: string | null;
  content: string;
  contentEs?: string | null;
  contentEn?: string | null;
  tags: string[];
  domain?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    console.log("!!! SAVE_PROMPT START !!!");
    console.log("Data Payload:", JSON.stringify(data, null, 2));
    console.log("!!! SAVE PROMPT V4 - FORCE UPDATE !!!");

    // Generate embedding for the new/updated content
    // Use available fields for vector text, defaulting to content if necessary
    const vectorTitle = data.titleEn || data.titleEs || "Untitled";
    const vectorDesc =
      data.descriptionEn || data.descriptionEs || "No description";
    const vectorText = `Title: ${vectorTitle}\nDescription: ${vectorDesc}\nContent: ${data.content}\nTags: ${data.tags.join(", ")}`;

    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(vectorText);
    } catch (e) {
      console.warn(
        "⚠️ Failed to generate embedding, saving without vector:",
        e,
      );
      // Proceed without embedding
    }

    // Prepare values for insertion/update
    const values = {
      titleEs: data.titleEs || data.titleEn || "",
      titleEn: data.titleEn || data.titleEs || "",
      descriptionEs: data.descriptionEs || data.descriptionEn || "",
      descriptionEn: data.descriptionEn || data.descriptionEs || "",
      content: data.content,
      contentEs: data.contentEs || null,
      contentEn: data.contentEn || null,
      tags: data.tags,
      domain: data.domain || "general",
      metadata: data.metadata || {},
      updatedAt: new Date(),
      ...(embedding ? { embedding } : {}), // Only include embedding if generated successfully
    };

    if (data.id) {
      // Update
      const existing = await db.query.prompts.findFirst({
        where: eq(prompts.id, data.id),
      });

      if (!existing) throw new Error("Prompt not found");

      // Cast versions to a mutable array or default to empty
      const history = (existing.versions as unknown[]) || [];
      const newVersion = (existing.version || 0) + 1;

      history.push({
        version: existing.version || 1,
        timestamp: new Date().toISOString(),
        content: existing.content,
        titleEn: existing.titleEn,
        titleEs: existing.titleEs,
        descriptionEn: existing.descriptionEn,
        descriptionEs: existing.descriptionEs,
        tags: existing.tags,
        domain: existing.domain,
        metadata: existing.metadata,
      });

      await db
        .update(prompts)
        .set({
          ...values,
          version: newVersion,
          versions: history,
        })
        .where(eq(prompts.id, data.id));
    } else {
      // Insert
      await db.insert(prompts).values({
        ...values,
        type: data.domain?.startsWith("logic") ? "skill" : "standard",
        version: 1,
        versions: [],
      });
    }

    revalidatePath("/[locale]/(sectors)/vault");
    return { success: true };
  } catch (error) {
    console.error("Error saving prompt:", error); // Log the actual error
    return { success: false, error: "Failed to save prompt" };
  }
}

export async function deletePrompt(id: string) {
  try {
    await db.delete(prompts).where(eq(prompts.id, id));
    revalidatePath("/[locale]/(sectors)/vault");
    return { success: true };
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return { success: false, error: "Failed to delete prompt" };
  }
}

// Helper to map DB result to UI type
type PromptRow = typeof prompts.$inferSelect;

function mapDbPromptsToType(
  dbPrompts: (Omit<PromptRow, "type" | "contentEs" | "contentEn" | "embedding"> &
    Partial<Pick<PromptRow, "contentEs" | "contentEn">>)[],
): Prompt[] {
  return dbPrompts.map((p) => ({
    id: p.id,
    title: p.titleEn, // Defaulting to English title for UI for now, or we could pass locale
    description: p.descriptionEn,
    tags: p.tags,
    domain: p.domain,
    metadata: p.metadata,
    versions: p.versions as Prompt["versions"],
    currentVersionId: p.id, // Using prompt ID as current version ID for simplicity in UI matching
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    // Add bilingual support if needed in UI types
    titleEs: p.titleEs,
    titleEn: p.titleEn,
    descriptionEs: p.descriptionEs,
    descriptionEn: p.descriptionEn,
    content: p.content,
    contentEs: p.contentEs,
    contentEn: p.contentEn,
  }));
}
