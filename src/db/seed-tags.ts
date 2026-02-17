import { db } from "@/db";
import { tagDimensions, tags } from "@/db/schema";

async function main() {
  console.log("🌱 Starting seed for Tagging System...");

  // 1. Dimensions
  const dimensionsData = [
    {
      id: "tech",
      nameEn: "Technology",
      nameEs: "Technology",
      descriptionEn: "AI models and specific inference engines.",
      descriptionEs: "Modelos de AI y motores específicos (GPT, Claude, etc).",
      color: "#3b82f6", // Blue
      icon: "Cpu",
    },
    {
      id: "task",
      nameEn: "Task",
      nameEs: "Tarea",
      descriptionEn: "The main functional action the prompt executes.",
      descriptionEs: "La acción funcional principal que ejecuta el prompt.",
      color: "#10b981", // Green
      icon: "Terminal",
    },
    {
      id: "industry",
      nameEn: "Industry",
      nameEs: "Industria",
      descriptionEn: "Knowledge sector or application market.",
      descriptionEs: "Sector de conocimiento o mercado de aplicación.",
      color: "#f59e0b", // Amber
      icon: "Briefcase",
    },
    {
      id: "persona",
      nameEn: "Persona",
      nameEs: "Persona",
      descriptionEn: "The expert identity or role the AI assumes.",
      descriptionEs: "La identidad o rol experto que asume la IA.",
      color: "#8b5cf6", // Violet
      icon: "User",
    },
    {
      id: "technique",
      nameEn: "Technique",
      nameEs: "Técnica",
      descriptionEn: "Logical prompt architecture (CoT, Few-shot).",
      descriptionEs: "Arquitectura lógica del prompt (CoT, Few-shot).",
      color: "#ec4899", // Pink
      icon: "Workflow",
    },
    {
      id: "tone",
      nameEn: "Tone",
      nameEs: "Tono",
      descriptionEn: "Communication style and response nuance.",
      descriptionEs: "Estilo comunicativo y matiz de la respuesta.",
      color: "#06b6d4", // Cyan
      icon: "Mic2",
    },
    {
      id: "governance",
      nameEn: "Governance",
      nameEs: "Governance",
      descriptionEn: "Safety, compliance, and operational efficiency.",
      descriptionEs: "Seguridad, cumplimiento y eficiencia operativa.",
      color: "#ef4444", // Red
      icon: "ShieldCheck",
    },
    {
      id: "visual",
      nameEn: "Visual",
      nameEs: "Visual",
      descriptionEn: "Aesthetics, composition, and technique for images.",
      descriptionEs: "Estética, composición y técnica para imágenes.",
      color: "#f43f5e", // Rose
      icon: "Image",
    },
  ];

  for (const d of dimensionsData) {
    await db.insert(tagDimensions).values(d).onConflictDoUpdate({
      target: tagDimensions.id,
      set: d,
    });
  }
  console.log("✅ Dimensions seeded.");

  // 2. Tags
  const tagsData = [
    // Tech
    {
      dimensionId: "tech",
      nameEn: "GPT-4o",
      nameEs: "GPT-4o",
      slug: "gpt-4o",
      descriptionEn: "OpenAI's state-of-the-art multimodal model.",
      descriptionEs: "Modelo multimodal más avanzado de OpenAI.",
    },
    {
      dimensionId: "tech",
      nameEn: "Claude 3.5 Sonnet",
      nameEs: "Claude 3.5 Sonnet",
      slug: "claude-3-5-sonnet",
      descriptionEn: "Anthropic's high-performance coding and nuance model.",
      descriptionEs: "Modelo de Anthropic destacado por código y matices.",
    },
    {
      dimensionId: "tech",
      nameEn: "Gemini 1.5 Pro",
      nameEs: "Gemini 1.5 Pro",
      slug: "gemini-1-5-pro",
      descriptionEn: "Google's massive context and reasoning model.",
      descriptionEs:
        "Modelo de Google con gran ventana de contexto y razonamiento.",
    },

    // Task
    {
      dimensionId: "task",
      nameEn: "SEO",
      nameEs: "SEO",
      slug: "seo",
      descriptionEn: "Search engine and keyword optimization.",
      descriptionEs: "Optimización para buscadores y palabras clave.",
    },
    {
      dimensionId: "task",
      nameEn: "Copywriting",
      nameEs: "Copywriting",
      slug: "copywriting",
      descriptionEn: "Persuasive writing oriented to sales.",
      descriptionEs: "Escritura persuasiva orientada a ventas.",
    },
    {
      dimensionId: "task",
      nameEn: "Coding",
      nameEs: "Coding",
      slug: "coding",
      descriptionEn: "Code generation and debugging.",
      descriptionEs: "Generación y depuración de código.",
    },
    {
      dimensionId: "task",
      nameEn: "Summarization",
      nameEs: "Resumen",
      slug: "summarization",
      descriptionEn: "Briefly explaining longer text.",
      descriptionEs: "Resumir textos largos de forma concisa.",
    },

    // Industry
    {
      dimensionId: "industry",
      nameEn: "Marketing",
      nameEs: "Marketing",
      slug: "marketing",
      descriptionEn: "Advertising and growth strategies.",
      descriptionEs: "Estrategias de publicidad y crecimiento.",
    },
    {
      dimensionId: "industry",
      nameEn: "SaaS",
      nameEs: "SaaS",
      slug: "saas",
      descriptionEn: "Software as a Service business model.",
      descriptionEs: "Modelo de negocio de software como servicio.",
    },
    {
      dimensionId: "industry",
      nameEn: "Education",
      nameEs: "Educación",
      slug: "education",
      descriptionEn: "Academic and learning content.",
      descriptionEs: "Contenido académico y de aprendizaje.",
    },

    // Persona
    {
      dimensionId: "persona",
      nameEn: "Senior Developer",
      nameEs: "Senior Developer",
      slug: "senior-dev",
      descriptionEn: "Expert programmer focusing on clean code.",
      descriptionEs: "Programador experto con enfoque en código limpio.",
    },
    {
      dimensionId: "persona",
      nameEn: "Academic Tutor",
      nameEs: "Tutor Académico",
      slug: "tutor",
      descriptionEn: "Mentor who explains complex topics simply.",
      descriptionEs: "Mentor que explica temas complejos de forma simple.",
    },

    // Technique
    {
      dimensionId: "technique",
      nameEn: "Chain-of-Thought",
      nameEs: "Chain-of-Thought",
      slug: "cot",
      descriptionEn: "Step-by-step reasoning process.",
      descriptionEs: "Proceso de razonamiento paso a paso.",
    },
    {
      dimensionId: "technique",
      nameEn: "Few-shot",
      nameEs: "Few-shot",
      slug: "few-shot",
      descriptionEn: "Providing context with examples.",
      descriptionEs: "Proporcionar contexto mediante ejemplos.",
    },

    // Tone
    {
      dimensionId: "tone",
      nameEn: "Professional",
      nameEs: "Profesional",
      slug: "pro-tone",
      descriptionEn: "Formal and direct tone.",
      descriptionEs: "Tono formal y directo.",
    },
    {
      dimensionId: "tone",
      nameEn: "Informal",
      nameEs: "Informal",
      slug: "informal-tone",
      descriptionEn: "Friendly and casual tone.",
      descriptionEs: "Tono amigable y casual.",
    },

    // Governance
    {
      dimensionId: "governance",
      nameEn: "SFW",
      nameEs: "SFW",
      slug: "sfw",
      descriptionEn: "Safe for work content.",
      descriptionEs: "Contenido seguro para el entorno laboral.",
    },
    {
      dimensionId: "governance",
      nameEn: "PII Redacted",
      nameEs: "PII Redacted",
      slug: "pii-safe",
      descriptionEn: "Free of personal identifiable information.",
      descriptionEs: "Libre de información personal identificable.",
    },

    // Visual
    {
      dimensionId: "visual",
      nameEn: "Cinematic",
      nameEs: "Cinemático",
      slug: "cinematic",
      descriptionEn: "Movie-like lighting and composition.",
      descriptionEs: "Iluminación y composición estilo película.",
    },
    {
      dimensionId: "visual",
      nameEn: "Minimalist",
      nameEs: "Minimalista",
      slug: "minimalist",
      descriptionEn: "Clean and simple visual style.",
      descriptionEs: "Estilo visual limpio y simple.",
    },
  ];

  for (const t of tagsData) {
    await db.insert(tags).values(t).onConflictDoUpdate({
      target: tags.slug,
      set: t,
    });
  }
  console.log("✅ Tags seeded.");
  console.log("🌱 Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
