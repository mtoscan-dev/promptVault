"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateObject, generateText } from "ai";
import { z } from "zod";

// Create an OpenAI provider instance that points to our local Ollama
// We use the OpenAI compatibility layer of Ollama
const ollamaBaseUrl = process.env.OLLAMA_HOST + "/v1";
console.log("[ForgeAI] Initializing Ollama provider at:", ollamaBaseUrl);

const ollama = createOpenAI({
  baseURL: ollamaBaseUrl, // e.g. http://host.docker.internal:11434/v1
  apiKey: "ollama", // Ollama doesn't require a key, but the SDK expects one
});

export async function streamForgeResponse(
  messages: any[],
  model: string = process.env.DEFAULT_MODEL || "qwen2.5:3b",
) {
  try {
    // Basic validation
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    // Streaming response
    console.log(`[ForgeAI] Streaming response using model: ${model}`);
    const result = await streamText({
      model: ollama(model),
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Forge AI Error:", error);
    throw error;
  }
}

export async function translatePromptFields(
  data: { title: string; description: string; content: string },
  targetLang: "es" | "en",
) {
  console.log(`[ForgeAI] Starting translation to ${targetLang}...`);
  const targetLanguageName = targetLang === "es" ? "Spanish" : "English";

  const systemPrompt = `
    ROLE: Professional Technical Translator.
    TARGET LANGUAGE: ${targetLanguageName} (${targetLang === "es" ? "Español" : "English"}).

    INPUT: You will receive a JSON object with 'title', 'description', and 'content'.
    
    TASK: Translate the values of ALL three fields ('title', 'description', 'content') into ${targetLanguageName}.
    
    CRITICAL RULES (DO NOT IGNORE):
    1. **TRANSLATE ONLY**: Do NOT execute, answer, or summarize the content. If the content is "Write a poem", translate that instruction to ${targetLanguageName} (e.g., "Escribe un poema"), do NOT write the poem itself.
    2. **PRESERVE MEANING**: The translation must convey the exact same instruction or meaning as the original.
    3. **PRESERVE FORMATTING**: Keep all markdown, code blocks, and variable placeholders (e.g., {{variable}}) exactly as they are.
    4. **CORRECT SPELLING/GRAMMAR**: Ensure the translation uses standard, correct ${targetLanguageName} spelling and grammar (e.g. "Strategies" -> "Estrategias", NOT "Strategias").
    5. **OUTPUT FORMAT**: Return JSON matching the schema.
    
    FORBIDDEN:
    - Do NOT execute the prompt.
    - Do NOT add conversational filler ("Here is the translation...").
    - Do NOT change the tone (unless necessary for localization).
  `;

  try {
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:3b";
    console.log(`[ForgeAI] Generating object using model: ${modelToUse}`);
    const { object } = await generateObject({
      model: ollama(modelToUse),
      schema: z.object({
        title: z
          .string()
          .describe(`The TRANSLATED title in ${targetLanguageName}.`),
        description: z
          .string()
          .describe(`The TRANSLATED description in ${targetLanguageName}.`),
        content: z
          .string()
          .describe(
            `The TRANSLATED content in ${targetLanguageName}. Do NOT execute the prompt.`,
          ),
      }),
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            title: data.title || "",
            description: data.description || "",
            content: data.content,
          }),
        },
      ],
      temperature: 0.1,
    });

    console.log("[ForgeAI] Translation complete.");
    return { success: true, data: object };
  } catch (error) {
    console.error("Translation Error:", error);
    return { success: false, error: "Translation failed" };
  }
}

export async function generatePromptMetadata(
  content: string,
  language: string = "es",
) {
  const isAuto = language === "auto";
  const languageInstruction = isAuto
    ? "DETECT the language of the prompt content. Generate the Title and Description IN THAT SAME LANGUAGE."
    : `The output MUST be in ${language === "en" ? "English" : "Spanish"} (${language}).`;

  const systemPrompt = `
    You are an expert Prompt Librarian and Technical Writer.
    
    TASK: Analyze the provided prompt content and generate metadata.
    
    RULES:
    1. ${languageInstruction}
    2. CRITICAL: If the instruction says "DETECT", you MUST output in the SAME language as the content.
    3. CRITICAL: If the instruction says "Spanish", the output MUST be 100% Spanish.
    4. Title: A concise, descriptive title in natural language (max 6 words). Use Title Case.
    5. Description: A concise summary of what this prompt does (max 15 words). Focus on the capability or output.
  `;

  try {
    console.log(`[ForgeAI] Generating metadata (Target: ${language})...`);
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:3b";
    console.log(`[ForgeAI] Metadata generation using model: ${modelToUse}`);
    const isSpanish =
      language === "es" || (isAuto && content.match(/[áéíóúñ¿¡]/i));

    const titleAudit = isSpanish
      ? "Título descriptivo en lenguaje natural (Español). Usa Mayúsculas Iniciales. NO uses guiones bajos."
      : "Descriptive title in natural language (English). Use Title Case. Do NOT use underscores.";

    const descAudit = isSpanish
      ? "Descripción concisa en ESPAÑOL de la utilidad del prompt (máx 15 palabras)."
      : "Concise description of the prompt's utility (max 15 words).";

    const { object } = await generateObject({
      model: ollama(modelToUse),
      schema: z.object({
        title: z.string().describe(titleAudit),
        description: z.string().describe(descAudit),
      }),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.3,
    });
    console.log("[ForgeAI] Metadata generation complete.");

    return { success: true, data: object };
  } catch (error) {
    console.error("Metadata Generation Error:", error);
    return { success: false, error: "Failed to generate metadata." };
  }
}

export async function analyzePromptEnhanced(
  content: string,
  language: string = "en",
) {
  const isSpanish = language === "es";
  const langName = isSpanish ? "Spanish" : "English";

  const systemPrompt = `
    ROLE: Expert Prompt Engineer and Quality Auditor.
    TASK: Systematically analyze the provided prompt using the "Prompt Evaluation Chain".
    
    EVALUATION CRITERIA WITH SCORING RUBRICS:
    
    A. Structure & Clarity (0-20 points):
       - Clarity/Specificity (0-5): Is the request unambiguous?
       - Instructions Structure (0-5): Are steps logically ordered?
       - Formatting (0-5): Is markup/formatting used effectively?
       - Brevity vs Detail (0-5): Is the level of detail appropriate?
    
    B. Context & Purpose (0-20 points):
       - Background Info (0-5): Is enough context provided?
       - Task Definition (0-5): Is the goal clearly stated?
       - Persona/Role (0-5): Is there a defined role or perspective?
       - Audience (0-5): Is the target audience clear?
    
    C. Instruction Quality (0-20 points):
       - Output Style (0-5): Is the desired output format specified?
       - Step-by-Step Reasoning (0-5): Does it encourage chain-of-thought?
       - Consistency (0-5): Are instructions internally consistent?
       - Examples (0-5): Are examples or few-shot patterns provided?
    
    D. Viability (0-15 points):
       - Iteration Potential (0-5): Can this prompt be easily refined?
       - Model Adequacy (0-5): Is this suited for the target model?
       - Constraints Feasibility (0-5): Are constraints realistic?
    
    SCORING RULES:
    - Score EACH sub-criterion from 0-5, then sum for the category total.
    - Be strict and consistent. A missing element scores 0-1 for that sub-criterion.
    - A present but weak element scores 2-3.
    - A well-implemented element scores 4-5.
    - Apply the SAME standards every time regardless of prompt length.

    OUTPUT RULES:
    1. Feedback must be in ${langName}.
    2. Be critical and use professional engineering terminology.
  `;

  try {
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:3b";
    console.log(`[ForgeAI] Enhanced Analysis using model: ${modelToUse}`);

    const { object } = await generateObject({
      model: ollama(modelToUse),
      schema: z.object({
        totalScore: z.number().int().min(0).max(75),
        categories: z.object({
          structure: z.object({
            score: z.number().min(0).max(20),
            feedback: z
              .string()
              .describe(`Brief analysis of category A in ${langName}.`),
            strengths: z
              .array(z.string())
              .describe("Specific strengths in category A."),
          }),
          context: z.object({
            score: z.number().min(0).max(20),
            feedback: z
              .string()
              .describe(`Brief analysis of category B in ${langName}.`),
          }),
          quality: z.object({
            score: z.number().min(0).max(20),
            feedback: z
              .string()
              .describe(`Brief analysis of category C in ${langName}.`),
          }),
          viability: z.object({
            score: z.number().min(0).max(15),
            feedback: z
              .string()
              .describe(`Brief analysis of category D in ${langName}.`),
          }),
        }),
        prioritySuggestions: z
          .array(z.string())
          .max(3)
          .describe(`Top 3 actionable improvements in ${langName}.`),
      }),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0,
    });

    // Override LLM's totalScore with actual sum — prevents hallucinated totals
    const computedTotal =
      object.categories.structure.score +
      object.categories.context.score +
      object.categories.quality.score +
      object.categories.viability.score;

    const correctedData = { ...object, totalScore: computedTotal };

    console.log("[ForgeAI] Enhanced Analysis complete:", correctedData);
    return { success: true, data: correctedData };
  } catch (error) {
    console.error("Enhanced Analysis Error:", error);
    return { success: false, error: "Failed to perform enhanced analysis." };
  }
}

export async function optimizePromptEnhanced(
  content: string,
  analysisReport: unknown,
  previousScore: number,
  language: string = "en",
) {
  const isSpanish = language === "es";
  const langLabel = isSpanish ? "Spanish" : "English";

  // Extract actionable suggestions and category scores for targeted improvements
  let improvements = "";
  let scoreContext = "";
  if (typeof analysisReport === "object" && analysisReport !== null) {
    const report = analysisReport as Record<string, unknown>;
    const suggestions = report.prioritySuggestions;
    if (Array.isArray(suggestions)) {
      improvements = suggestions
        .map((s: unknown, i: number) => `${i + 1}. ${String(s)}`)
        .join("\n");
    }
    // Extract category scores so the model knows what's weakest
    const cats = report.categories as
      | Record<string, { score?: number }>
      | undefined;
    if (cats) {
      const scores = [
        `Structure: ${cats.structure?.score ?? "?"}/20`,
        `Context: ${cats.context?.score ?? "?"}/20`,
        `Quality: ${cats.quality?.score ?? "?"}/20`,
        `Viability: ${cats.viability?.score ?? "?"}/15`,
      ];
      scoreContext = `\nCurrent scores (focus on the lowest):\n${scores.join(" | ")}`;
    }
  }

  // For 3B models: keep the system prompt SHORT and concrete.
  // Verbose rubrics get copied into the output as template sections.
  const systemPrompt = `You MUST write in ${langLabel}. Output ONLY the rewritten prompt.

Rewrite the user's prompt to be higher quality. Include these elements:
- Start with a role: "Act as a [specific expert]"
- Add background context (1-2 sentences explaining why)
- State the goal clearly in one sentence
- Mention the target audience
- Use numbered steps for instructions
- Specify the output format (e.g. markdown, JSON, table)
- Add one brief example of expected output
- Use markdown formatting
${scoreContext ? `\nWeakest areas to focus on:\n${scoreContext}` : ""}
${improvements ? `\nSpecific fixes:\n${improvements}` : ""}

STRICT RULES:
- Keep the rewritten prompt under 600 words. Be concise.
- Do NOT include section headers like "Instruction Quality" or "Viability".
- Do NOT add commentary before or after the prompt.
- Start your response directly with "Act as" or "# ".`;

  try {
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:3b";
    console.log(
      `[ForgeAI] Enhanced Optimization with generateText (score: ${previousScore}/75)...`,
    );

    // Truncate very long input to prevent timeouts and score=0 on re-analysis
    const maxInputChars = 2000;
    const inputContent =
      content.length > maxInputChars
        ? content.substring(0, maxInputChars) +
          "\n\n[...truncated for optimization]"
        : content;

    const { text } = await generateText({
      model: ollama(modelToUse),
      system: systemPrompt,
      prompt: inputContent,
      temperature: 0.6,
      maxOutputTokens: 400,
    });

    // Post-process: strip meta-commentary that small models add
    let optimizedContent = text.trim();

    // Strip preamble lines (e.g. "Here is the revised prompt:", "As a prompt engineer...")
    optimizedContent = optimizedContent
      .replace(
        /^(?:(?:here is|below is|i will|let me|this is|as a prompt)[^\n]*\n+(?:---\n)?)/i,
        "",
      )
      .replace(/^---\n+/, "");

    // Strip epilogue (e.g. "This revised version provides...")
    optimizedContent = optimizedContent.replace(
      /\n+(?:---\n+)?(?:this (?:revised|enhanced|improved|updated|new|rewritten) (?:version|prompt)[^\n]*\.?\s*)$/i,
      "",
    );

    // Strip leaked rubric category headers
    optimizedContent = optimizedContent.replace(
      /\n+(?:Instruction Quality|Viability|Structure & Clarity|Context & Purpose):?\n/gi,
      "\n",
    );

    optimizedContent = optimizedContent.trim();

    // Guard: empty output
    if (!optimizedContent || optimizedContent.length < 10) {
      console.warn("[ForgeAI] Optimizer returned empty/too-short output");
      return { success: false, error: "Optimization produced invalid output." };
    }

    // Guard: identical content (model echoed input)
    if (optimizedContent.toLowerCase() === content.trim().toLowerCase()) {
      console.warn("[ForgeAI] Optimizer returned identical content — skipping");
      return { success: false, error: "Optimization produced no changes." };
    }

    console.log(
      `[ForgeAI] Optimization complete: ${content.length} → ${optimizedContent.length} chars`,
    );
    return { success: true, data: { optimizedContent } };
  } catch (error) {
    console.error("Enhanced Optimization Error:", error);
    return { success: false, error: "Failed to optimize prompt." };
  }
}

import { db } from "@/db";
import { tags as tagsTable, tagDimensions } from "@/db/schema";
import { SmartTag } from "@/types";

export async function suggestSmartTags(content: string, locale: string = "en") {
  const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:3b";
  console.log(`[ForgeAI] Suggesting smart tags using model: ${modelToUse}...`);

  try {
    const isSpanish = locale === "es";

    // 1. Fetch Taxomony from Database
    const allTags = await db.select().from(tagsTable);
    const allDimensions = await db.select().from(tagDimensions);

    // 2. Build Context for LLM
    const tagsContext = allTags
      .map((t) => {
        const desc = isSpanish ? t.descriptionEs : t.descriptionEn;
        const name = isSpanish ? t.nameEs : t.nameEn;
        // Optimization: Include Dimension Name for better context
        const paramDim = allDimensions.find((d) => d.id === t.dimensionId);
        const dimName = isSpanish ? paramDim?.nameEs : paramDim?.nameEn;

        return `- [${t.slug}] (${dimName}): ${name} - ${desc}`;
      })
      .join("\n");

    const systemPrompt = `
    ROLE: Expert Taxonomy Specialist and Content Classifier.
    
    TASK: Analyze the provided prompt content and assign relevant tags from the database.
    
    TAXONOMY DATABASE:
    ${tagsContext}
    
    RULES:
    1. Select ONLY tags that strictly apply to the content.
    2. Analyze the semantic intent of the prompt.
    3. Return a JSON array of tag IDs (the values in brackets [] e.g. "seo").
    4. Max 5 tags.
    5. OUTPUT FORMAT: JSON Object with "tagIds" array.
    `;

    const { object } = await generateObject({
      model: ollama(modelToUse),
      schema: z.object({
        tagIds: z
          .array(z.string())
          .describe("List of relevant tag IDs (slugs) from the taxonomy."),
      }),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.1, // Low temp for precision
    });

    console.log("[ForgeAI] Suggested Tag IDs:", object.tagIds);

    // 3. Hydrate tags from DB records
    // We map the DB 'slug' to the 'id' field expected by the UI/SmartTag interface
    const hydratedTags = object.tagIds
      .map((slug) => allTags.find((t) => t.slug === slug))
      .filter((t): t is (typeof allTags)[0] => !!t)
      .map((t) => ({
        id: t.slug, // UI expects 'id' for selection
        nameEn: t.nameEn,
        nameEs: t.nameEs,
        descriptionEn: t.descriptionEn || "",
        descriptionEs: t.descriptionEs || "",
        dimensionId: t.dimensionId,
      })) as SmartTag[];

    return { success: true, data: hydratedTags };
  } catch (error) {
    console.error("Tag Suggestion Error:", error);
    return { success: false, error: "Failed to suggest tags." };
  }
}

export async function checkAIGateway() {
  try {
    const model = process.env.DEFAULT_MODEL || "qwen2.5:3b";
    console.log(`[ForgeAI] Checking health with model: ${model}`);

    // Simple fast check
    const { text } = await generateText({
      model: ollama(model),
      prompt: "respond with 'ok'",
    });

    return { success: true, model, status: text };
  } catch (error: any) {
    console.error(`[ForgeAI] Health Check Failed: ${error.message}`);
    const host = process.env.OLLAMA_HOST || "unknown";
    return {
      success: false,
      error: error.message,
      host,
      hint: host.includes("localhost")
        ? "Docker container cannot reach 'localhost'. Use 'host.docker.internal' and ensure Ollama binds to 0.0.0.0"
        : "Check Ollama logs",
    };
  }
}

/**
 * Lightweight system status check for the SystemMonitor component.
 * Fetches real CPU usage, Ollama connectivity, and model memory — no LLM inference.
 */
export async function getSystemStatus() {
  const host = process.env.OLLAMA_HOST || "http://localhost:11434";
  const defaultModel = process.env.DEFAULT_MODEL || "qwen2.5:3b";

  // --- CPU Usage (delta measurement for real-time load) ---
  const os = await import("os");

  const getCpuSnapshot = () => {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
      for (const type in cpu.times) {
        total += cpu.times[type as keyof typeof cpu.times];
      }
      idle += cpu.times.idle;
    }
    return { idle, total };
  };

  const snap1 = getCpuSnapshot();
  await new Promise((r) => setTimeout(r, 500));
  const snap2 = getCpuSnapshot();

  const idleDelta = snap2.idle - snap1.idle;
  const totalDelta = snap2.total - snap1.total;
  const cpuPercent =
    totalDelta > 0
      ? Math.round(((totalDelta - idleDelta) / totalDelta) * 100)
      : 0;

  // --- Ollama Status ---
  let ollamaOnline = false;
  let activeModel: string | null = null;
  let modelMemoryMB = 0;

  try {
    // Check connectivity + available models via /api/tags
    const tagsRes = await fetch(`${host}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });

    if (tagsRes.ok) {
      ollamaOnline = true;
      const tagsData = await tagsRes.json();
      // Find the configured model in available models
      const models = tagsData.models || [];
      const configuredModel = models.find(
        (m: any) =>
          m.name === defaultModel || m.name === `${defaultModel}:latest`,
      );
      activeModel = configuredModel?.name || models[0]?.name || defaultModel;
    }

    // Get running model memory via /api/ps
    if (ollamaOnline) {
      try {
        const psRes = await fetch(`${host}/api/ps`, {
          signal: AbortSignal.timeout(3000),
        });
        if (psRes.ok) {
          const psData = await psRes.json();
          const runningModels = psData.models || [];
          if (runningModels.length > 0) {
            // Use the first running model's size (bytes -> MB)
            const sizeBytes = runningModels[0].size || 0;
            modelMemoryMB = Math.round(sizeBytes / (1024 * 1024));
            // Override activeModel with what's actually running
            activeModel = runningModels[0].name || activeModel;
          }
        }
      } catch {
        // /api/ps failed but Ollama is still online (no model loaded)
      }
    }
  } catch {
    ollamaOnline = false;
  }

  return {
    cpu: cpuPercent,
    ollama: {
      online: ollamaOnline,
      model: activeModel,
      memoryMB: modelMemoryMB,
    },
  };
}

export async function getTaxonomy() {
  try {
    const dimensions = await db.select().from(tagDimensions);
    const tags = await db.select().from(tagsTable);

    // Map DB tags to UI format (using slug as ID)
    const mappedTags = tags.map((t) => ({
      id: t.slug,
      dimensionId: t.dimensionId,
      nameEn: t.nameEn,
      nameEs: t.nameEs,
      descriptionEn: t.descriptionEn || "",
      descriptionEs: t.descriptionEs || "",
    }));

    return {
      success: true,
      data: {
        dimensions,
        tags: mappedTags,
      },
    };
  } catch (error) {
    console.error("Failed to fetch taxonomy:", error);
    return { success: false, error: "Failed to load taxonomy" };
  }
}

export async function predictDimension(
  tagName: string,
  dimensions: { id: string; nameEn: string; nameEs: string }[],
): Promise<{ success: boolean; dimensionId?: string }> {
  try {
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:3b";

    const context = dimensions
      .map((d) => `- ID: ${d.id}, Name: ${d.nameEn} / ${d.nameEs}`)
      .join("\n");

    const systemPrompt = `
      ROLE: Taxonomy Expert.
      TASK: Predict the most appropriate Dimension ID for a new Tag.
      
      AVAILABLE DIMENSIONS:
      ${context}
      
      INPUT: New Tag Name: "${tagName}"
      
      RULES:
      1. Analyze the semantic meaning of the tag.
      2. Match it to the best fitting Dimension from the list.
      3. Return ONLY the Dimension ID.
      4. If unsure, return "unknown".
    `;

    const { object } = await generateObject({
      model: ollama(modelToUse),
      schema: z.object({
        dimensionId: z.string(),
      }),
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.1,
    });

    // Verify the predicted ID exists
    const isValid = dimensions.some((d) => d.id === object.dimensionId);

    return {
      success: true,
      dimensionId: isValid ? object.dimensionId : dimensions[0]?.id,
    };
  } catch (error) {
    console.error("Dimension Prediction Error:", error);
    // Fallback to first dimension if error
    return { success: false, dimensionId: dimensions[0]?.id };
  }
}
