"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema";
import { generateEmbedding } from "@/lib/vectorize";
import { Prompt } from "@/types";
import { cosineDistance, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function searchPrompts(query: string) {
  try {
    if (!query) {
      // Return standard prompts sorted by date if no query
      const results = await db
        .select()
        .from(prompts)
        .where(eq(prompts.type, "standard"))
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
        version: prompts.version,
        versions: prompts.versions,
        createdAt: prompts.createdAt,
        updatedAt: prompts.updatedAt,
        similarity,
      })
      .from(prompts)
      .where(eq(prompts.type, "standard"))
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
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  content: string;
  tags: string[];
}) {
  try {
    // Generate embedding for the new/updated content
    const vectorText = `${data.titleEn} ${data.descriptionEn} ${data.content} ${data.tags.join(" ")}`;
    const embedding = await generateEmbedding(vectorText);

    if (data.id) {
      // Update existing
      const existing = await db.query.prompts.findFirst({
        where: eq(prompts.id, data.id),
      });

      if (!existing) throw new Error("Prompt not found");

      const newVersion = (existing.version || 0) + 1;
      const history = (existing.versions as any[]) || [];

      history.push({
        id: crypto.randomUUID(),
        content: existing.content,
        version: existing.version,
        createdAt: new Date().toISOString(),
      });

      await db
        .update(prompts)
        .set({
          titleEs: data.titleEs,
          titleEn: data.titleEn,
          descriptionEs: data.descriptionEs,
          descriptionEn: data.descriptionEn,
          content: data.content,
          tags: data.tags,
          embedding,
          version: newVersion,
          versions: history,
          updatedAt: new Date(),
        })
        .where(eq(prompts.id, data.id));
    } else {
      // Create new
      await db.insert(prompts).values({
        type: "standard",
        titleEs: data.titleEs,
        titleEn: data.titleEn,
        descriptionEs: data.descriptionEs,
        descriptionEn: data.descriptionEn,
        content: data.content,
        tags: data.tags,
        embedding,
        version: 1,
        versions: [],
      });
    }

    revalidatePath("/[locale]/(sectors)/vault");
    return { success: true };
  } catch (error) {
    console.error("❌ Save failed:", error);
    return { success: false, error: String(error) };
  }
}

// Helper to map DB result to UI type
function mapDbPromptsToType(dbPrompts: any[]): Prompt[] {
  return dbPrompts.map((p) => ({
    id: p.id,
    title: p.titleEn, // Defaulting to English title for UI for now, or we could pass locale
    description: p.descriptionEn,
    tags: p.tags,
    versions: p.versions,
    currentVersionId: p.id, // Using prompt ID as current version ID for simplicity in UI matching
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    // Add bilingual support if needed in UI types
    titleEs: p.titleEs,
    titleEn: p.titleEn,
    descriptionEs: p.descriptionEs,
    descriptionEn: p.descriptionEn,
    content: p.content,
  }));
}
