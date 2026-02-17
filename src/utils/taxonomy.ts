export const TAXONOMY = {
  dimensions: [
    {
      id: "tech",
      nameEn: "Technology",
      nameEs: "Tecnología",
      descriptionEn: "AI models and specific inference engines.",
      descriptionEs: "Modelos de AI y motores específicos (GPT, Claude, etc).",
    },
    {
      id: "task",
      nameEn: "Task",
      nameEs: "Tarea",
      descriptionEn: "The main functional action the prompt executes.",
      descriptionEs: "La acción funcional principal que ejecuta el prompt.",
    },
    {
      id: "domain",
      nameEn: "Industry",
      nameEs: "Industria",
      descriptionEn: "Knowledge sector or application market.",
      descriptionEs: "Sector de conocimiento o mercado de aplicación.",
    },
    {
      id: "persona",
      nameEn: "Persona",
      nameEs: "Persona",
      descriptionEn: "The expert identity or role the AI assumes.",
      descriptionEs: "La identidad o rol experto que asume la IA.",
    },
    {
      id: "technique",
      nameEn: "Technique",
      nameEs: "Técnica",
      descriptionEn: "Logical prompt architecture (CoT, Few-shot).",
      descriptionEs: "Arquitectura lógica del prompt (CoT, Few-shot).",
    },
    {
      id: "tone",
      nameEn: "Tone",
      nameEs: "Tono",
      descriptionEn: "Communication style and response nuance.",
      descriptionEs: "Estilo comunicativo y matiz de la respuesta.",
    },
    {
      id: "gov",
      nameEn: "Governance",
      nameEs: "Gobernanza",
      descriptionEn: "Safety, compliance, and operational efficiency.",
      descriptionEs: "Seguridad, cumplimiento y eficiencia operativa.",
    },
  ],
  tags: [
    // Task
    {
      id: "seo",
      dimensionId: "task",
      nameEn: "SEO",
      nameEs: "SEO",
      descriptionEn: "Search engine and keyword optimization.",
      descriptionEs:
        "Optimización para buscadores y keywords, meta-descripciones.",
    },
    {
      id: "copy",
      dimensionId: "task",
      nameEn: "Copywriting",
      nameEs: "Copywriting",
      descriptionEn: "Persuasive writing oriented to sales.",
      descriptionEs: "Escritura persuasiva orientada a ventas y conversión.",
    },
    {
      id: "code",
      dimensionId: "task",
      nameEn: "Coding",
      nameEs: "Coding",
      descriptionEn: "Code generation and debugging.",
      descriptionEs: "Generación y depuración de código.",
    },
    {
      id: "trans",
      dimensionId: "task",
      nameEn: "Translation",
      nameEs: "Traducción",
      descriptionEn: "Language switching while preserving context.",
      descriptionEs: "Cambio de idioma manteniendo el contexto y tono.",
    },
    {
      id: "sum",
      dimensionId: "task",
      nameEn: "Summarization",
      nameEs: "Resumen",
      descriptionEn: "Condensing information into key points.",
      descriptionEs: "Identificación y síntesis de ideas clave.",
    },
    // Technique
    {
      id: "cot",
      dimensionId: "technique",
      nameEn: "Chain-of-Thought",
      nameEs: "Chain-of-Thought",
      descriptionEn: "Explicit step-by-step reasoning.",
      descriptionEs: "Razonamiento desglosado paso a paso explícito.",
    },
    {
      id: "fewshot",
      dimensionId: "technique",
      nameEn: "Few-shot",
      nameEs: "Few-shot",
      descriptionEn: "Including examples to guide the style.",
      descriptionEs: "Inclusión de ejemplos para guiar el estilo de respuesta.",
    },
    {
      id: "zeroshot",
      dimensionId: "technique",
      nameEn: "Zero-shot",
      nameEs: "Zero-shot",
      descriptionEn: "Direct instruction without examples.",
      descriptionEs: "Instrucción directa sin ejemplos previos.",
    },
    // Persona
    {
      id: "dev",
      dimensionId: "persona",
      nameEn: "Developer",
      nameEs: "Desarrollador",
      descriptionEn: "Expert software engineer logic.",
      descriptionEs:
        "Experto en ingeniería de software, arquitectura y código limpio.",
    },
    {
      id: "tutor",
      dimensionId: "persona",
      nameEn: "Tutor",
      nameEs: "Tutor",
      descriptionEn: "Educational and explanatory tone.",
      descriptionEs:
        "Mentor pedagógico que explica conceptos complejos simplificados.",
    },
    {
      id: "analyst",
      dimensionId: "persona",
      nameEn: "Analyst",
      nameEs: "Analista",
      descriptionEn: "Data-driven and logical perspective.",
      descriptionEs: "Enfoque basado en datos, lógica rigurosa y patrones.",
    },
    // Tone
    {
      id: "prof",
      dimensionId: "tone",
      nameEn: "Professional",
      nameEs: "Profesional",
      descriptionEn: "Corporate, neutral, and direct tone.",
      descriptionEs: "Tono corporativo, neutro y directo.",
    },
    {
      id: "persuasive",
      dimensionId: "tone",
      nameEn: "Persuasive",
      nameEs: "Persuasivo",
      descriptionEn: "Oriented to convincing or motivating.",
      descriptionEs: "Orientado a convencer, motivar o vender.",
    },
    {
      id: "casual",
      dimensionId: "tone",
      nameEn: "Casual",
      nameEs: "Casual",
      descriptionEn: "Friendly and informal communication.",
      descriptionEs: "Comunicación cercana, amigable e informal.",
    },
  ],
};

export type SmartTag = {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  dimensionId: string;
};
