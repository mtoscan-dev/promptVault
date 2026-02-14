import { db } from "./index";
import { personas, prompts, governance } from "./schema";
import { generateEmbedding } from "../lib/vectorize";
import { sql } from "drizzle-orm"; // Add import

async function main() {
  console.log("🌱 Iniciando siembra del Búnker...");

  // 1. Seed de Personas
  await db.insert(personas).values({
    name: "Patagonia Architect",
    role: "Senior Fullstack Developer & DevOps",
    systemPrompt:
      "Eres un arquitecto de software soberano, experto en Next.js y Docker. Priorizas la eficiencia y el minimalismo.",
    modelPreference: "qwen2.5:7b",
    temperature: 0.3,
  });

  // 2. Seed de Vault Assets (Prompts & Skills)
  const vaultAssets = [
    // Standard Prompts (Vault Knowledge)
    {
      type: "standard" as const,
      titleEs: "Experto en SQL",
      titleEn: "SQL Expert",
      descriptionEs: "Genera consultas complejas optimizadas para Postgres.",
      descriptionEn: "Generates complex queries optimized for Postgres.",
      content:
        "Actúa como un DBA experto en PostgreSQL. Tu objetivo es escribir consultas SQL eficientes, seguras y bien documentadas based on user requirements...",
      tags: ["database", "sql", "backend"],
      version: 1,
    },
    {
      type: "standard" as const,
      titleEs: "Storyteller Creativo",
      titleEn: "Creative Storyteller",
      descriptionEs: "Ayuda a escribir narrativas envolventes.",
      descriptionEn: "Helps write immersive narratives.",
      content:
        "You are a master storyteller. Create compelling narratives with deep character development and plot twists...",
      tags: ["creative", "writing", "storytelling"],
      version: 1,
    },
    // Skills (Functional Prompts for Forge)
    {
      type: "skill" as const,
      titleEs: "Optimizador de React",
      titleEn: "React Optimizer",
      descriptionEs: "Analiza y optimiza componentes React.",
      descriptionEn: "Analyzes and optimizes React components.",
      content:
        "Analyze the provided React component for performance bottlenecks, re-renders, and memory leaks. Suggest optimizations using React.memo, useMemo, and useCallback...",
      tags: ["coding", "react", "optimization"],
      version: 1,
      metadata: {
        cli_prefix: "claude-opt",
        engine: "claude-code-v1",
      },
    },
  ];

  for (const asset of vaultAssets) {
    // Generate semantic vector for search
    const vectorText = `${asset.titleEn} ${asset.descriptionEn} ${asset.content} ${asset.tags.join(" ")}`;
    const embedding = await generateEmbedding(vectorText);

    console.log(
      `Generated embedding for ${asset.titleEn}:`,
      Array.isArray(embedding),
      embedding?.length,
    );

    // Format for Postgres vector
    const embeddingString = `[${embedding.join(",")}]`;

    await db.insert(prompts).values({
      type: asset.type,
      titleEs: asset.titleEs,
      titleEn: asset.titleEn,
      descriptionEs: asset.descriptionEs,
      descriptionEn: asset.descriptionEn,
      content: asset.content,
      tags: asset.tags,
      version: asset.version,
      versions: [
        {
          id: crypto.randomUUID(),
          content: asset.content,
          version: 1,
          createdAt: new Date(),
        },
      ],
      embedding: sql`${embeddingString}::vector`,
      metadata: asset.metadata || {},
    });
    console.log(`✅ Asset seeded: ${asset.titleEn}`);
  }

  // 3. Seed de Governance (White Hat)
  await db.insert(governance).values({
    type: "protocol",
    title: "White Hat Marketing Standard",
    content:
      "Todas las estrategias de Starflow deben evitar patrones oscuros y priorizar la transparencia del usuario.",
    fileName: "marketing_ethics.md",
  });

  console.log("✅ Búnker sembrado con éxito.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error en la siembra:", err);
  process.exit(1);
});
