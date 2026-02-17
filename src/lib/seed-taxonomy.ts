import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tagDimensions, tags } from "../db/schema";
import { TAXONOMY } from "../utils/taxonomy";
import { eq } from "drizzle-orm";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://admin:secret@localhost:5433/promptvault_db";
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log("🌱 Seeding Taxonomy...");

  // 1. Seed Dimensions
  console.log("... Seeding Dimensions");
  for (const dim of TAXONOMY.dimensions) {
    await db
      .insert(tagDimensions)
      .values({
        id: dim.id,
        nameEn: dim.nameEn,
        nameEs: dim.nameEs,
        descriptionEn: dim.descriptionEn,
        descriptionEs: dim.descriptionEs,
      })
      .onConflictDoUpdate({
        target: tagDimensions.id,
        set: {
          nameEn: dim.nameEn,
          nameEs: dim.nameEs,
          descriptionEn: dim.descriptionEn,
          descriptionEs: dim.descriptionEs,
        },
      });
  }

  // 2. Seed Tags
  console.log("... Seeding Tags");
  for (const tag of TAXONOMY.tags) {
    await db
      .insert(tags)
      .values({
        slug: tag.id, // Using the 'id' from taxonomy as slug
        dimensionId: tag.dimensionId,
        nameEn: tag.nameEn,
        nameEs: tag.nameEs,
        descriptionEn: tag.descriptionEn,
        descriptionEs: tag.descriptionEs,
      })
      .onConflictDoUpdate({
        target: tags.slug,
        set: {
          dimensionId: tag.dimensionId,
          nameEn: tag.nameEn,
          nameEs: tag.nameEs,
          descriptionEn: tag.descriptionEn,
          descriptionEs: tag.descriptionEs,
        },
      });
  }

  console.log("✅ Taxonomy Seeded Successfully!");
  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
