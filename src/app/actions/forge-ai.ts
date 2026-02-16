"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateObject } from "ai";
import { z } from "zod";

// Create an OpenAI provider instance that points to our local Ollama
// We use the OpenAI compatibility layer of Ollama
const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_HOST + "/v1", // e.g. http://ollama:11434/v1
  apiKey: "ollama", // Ollama doesn't require a key, but the SDK expects one
});

export async function streamForgeResponse(
  messages: any[],
  model: string = process.env.DEFAULT_MODEL || "qwen2.5:14b",
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

    RULES:
    1. 'title': Translate to ${targetLanguageName}. NEVER return the original English title unless it is a product name (e.g., "iPhone").
    2. 'description': Translate to ${targetLanguageName}. MUST be in ${targetLanguageName}.
    3. 'content': Translate to ${targetLanguageName}. Preserve markdown.
    4. CRITICAL: The output must be 100% ${targetLanguageName}.
    5. Technical terms (e.g. "React", "SaaS") stay in English, but the sentence structure MUST be ${targetLanguageName}.

    FORBIDDEN:
    - Do NOT return the input text as the output.
    - Do NOT omit any fields.
  `;

  try {
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:14b";
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
          .describe(`The translated prompt content in ${targetLanguageName}.`),
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
      temperature: 0.1, // Lower temperature for maximum determinism
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
    4. Title: A concise, descriptive title in natural language (max 6 words). Use Title Case (e.g., "Python Script Generator", NOT "python_script_generator").
    5. Description: A concise summary of what this prompt does (max 15 words). Focus on the capability or output.
    
    Example (Auto/English content):
    Content: "Write a python script to..."
    Title: "Python Script Generator"
    Description: "Generates Python scripts for automation tasks"

    Example (Auto/Spanish content):
    Content: "Escribe un poema sobre..."
    Title: "Generador de Poemas"
    Description: "Crea poemas sobre temas específicos"
  `;

  try {
    console.log(`[ForgeAI] Generating metadata (Target: ${language})...`);
    const modelToUse = process.env.DEFAULT_MODEL || "qwen2.5:14b";
    console.log(`[ForgeAI] Metadata generation using model: ${modelToUse}`);
    const isSpanish =
      language === "es" || (isAuto && content.match(/[áéíóúñ¿¡]/i));

    const titleAudit = isSpanish
      ? "Título descriptivo en lenguaje natural (Español). Usa Mayúsculas Iniciales (e.g. 'Mi Prompt'). NO uses guiones bajos."
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
