import { db } from "./index";
import { prompts } from "./schema";
import { generateEmbedding } from "../lib/vectorize";
import { eq, sql } from "drizzle-orm";

async function main() {
  console.log("🔄 Regenerando embeddings de todos los prompts...");

  const allPrompts = await db.select().from(prompts);
  console.log(`Encontrados ${allPrompts.length} prompts.`);

  for (const p of allPrompts) {
    const vectorTitle = p.titleEn || p.titleEs || "Untitled";
    const vectorDesc = p.descriptionEn || p.descriptionEs || "No description";
    const vectorText = `Title: ${vectorTitle}\nDescription: ${vectorDesc}\nContent: ${p.content}\nTags: ${(p.tags || []).join(", ")}`;

    try {
      const embedding = await generateEmbedding(vectorText);
      const embeddingString = `[${embedding.join(",")}]`;

      await db
        .update(prompts)
        .set({ embedding: sql`${embeddingString}::vector` })
        .where(eq(prompts.id, p.id));

      console.log(`✅ ${p.titleEn || p.id}`);
    } catch (error) {
      console.error(`❌ Failed for ${p.titleEn || p.id}:`, error);
    }
  }

  console.log("✅ Backfill de embeddings completo.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error en el backfill:", err);
  process.exit(1);
});
