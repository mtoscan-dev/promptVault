import { db } from "./index";
import { personas, prompts, governance } from "./schema";

async function main() {
  console.log("🌱 Iniciando siembra del Búnker...");

  // 1. Seed de Personas
  const personaId = await db
    .insert(personas)
    .values({
      name: "Patagonia Architect",
      role: "Senior Fullstack Developer & DevOps",
      systemPrompt:
        "Eres un arquitecto de software soberano, experto en Next.js y Docker. Priorizas la eficiencia y el minimalismo.",
      modelPreference: "qwen2.5:7b",
      temperature: 0.3,
    })
    .returning({ id: personas.id });

  // 2. Seed de Skills (Claude Code)
  await db.insert(prompts).values({
    type: "skill",
    title: "Claude Code React Optimizer",
    domain: "Frontend_Dev",
    promptEs: "Optimiza este componente de React para reducir el uso de RAM...",
    promptEn: "Optimize this React component to reduce RAM usage...",
    metadata: {
      cli_prefix: "claude-opt",
      input_schema: { vars: ["component_path"] },
      engine: "claude-code-v1",
    },
  });

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
