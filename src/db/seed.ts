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
    modelPreference: "qwen2.5:3b",
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
        "Actúa como un DBA Senior experto en PostgreSQL. Tu objetivo es escribir consultas SQL altamente optimizadas, seguras y escalables.\n\nReglas:\n1. Prioriza el rendimiento y la eficiencia.\n2. Sigue las mejores prácticas de seguridad.\n3. Documenta el código con comentarios claros.\n4. Si el usuario pregunta en inglés, responde en inglés. Si es español, en español.",
      tags: ["database", "sql", "backend"],
      domain: "vault:standard",
      version: 1,
      metadata: {
        complexity: "advanced",
        tool_compatibility: ["all"],
      },
    },
    {
      type: "standard" as const,
      titleEs: "Storyteller Creativo",
      titleEn: "Creative Storyteller",
      descriptionEs: "Ayuda a escribir narrativas envolventes.",
      descriptionEn: "Helps write immersive narratives.",
      content:
        "You are a master storyteller and creative writer. Your goal is to craft immersive narratives with deep character development and unexpected plot twists.\n\nGuidelines:\n1. Show, don't just tell.\n2. Focus on sensory details and emotional resonance.\n3. Develop complex characters with clear motivations.\n4. Adapt your tone to the requested genre.\n5. If the user prompts in Spanish, reply in Spanish. If English, reply in English.",
      tags: ["creative", "writing", "storytelling"],
      domain: "vault:creative",
      version: 1,
      metadata: {
        complexity: "intermediate",
        temperature_suggestion: 0.8,
      },
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
      domain: "logic:react",
      version: 1,
      metadata: {
        cli_prefix: "claude-opt",
        engine: "claude-code",
        tool_compatibility: ["claude", "cursor"],
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
      domain: asset.domain, // New field
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
