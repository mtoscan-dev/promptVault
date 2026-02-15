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
  model: string = "qwen2.5:1.5b",
) {
  try {
    // Basic validation
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    // Streaming response
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

    INSTRUCTIONS:
    1. Translate the input text accurately to ${targetLanguageName}.
    2. DO NOT MIX LANGUAGES. The output must be 100% ${targetLanguageName}, except for technical terms.
    3. KEEP technical terms (e.g., "SaaS", "product-led growth", "React", "Next.js") in English/original.
    4. Maintain the original structure and formatting.
    5. If title or description are empty, return null.

    GLOSSARY (Use these translations for commands):
    - "Research" -> "Investiga" (NOT "Recherche")
    - "Analyze" -> "Analiza"
    - "Create" -> "Crea"
    - "Write" -> "Escribe"

    CRITICAL: 
    - Do NOT use French ("Recherche"), Italian, or Portuguese words.
    - Use standard, professional ${targetLanguageName}.
  `;

  try {
    const { object } = await generateObject({
      model: ollama("qwen2.5:1.5b"),
      schema: z.object({
        title: z
          .string()
          .nullable()
          .optional()
          .describe(`The translated title (or null if input was empty)`),
        description: z
          .string()
          .nullable()
          .optional()
          .describe(`The translated description (or null if input was empty)`),
        content: z
          .string()
          .describe(
            `The translated prompt content in ${targetLanguageName}, preserving structure and variables`,
          ),
      }),
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            title: data.title,
            description: data.description,
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
  const languageName = language === "en" ? "English" : "Spanish";

  const systemPrompt = `
    You are an expert Prompt Librarian and Technical Writer.
    
    TASK: Analyze the provided prompt content and generate metadata.
    
    RULES:
    1. The output MUST be in ${languageName} (${language}).
    2. Generate the Title and Description IN ${languageName}.
    3. Title: A short, punchy, CLI-style command or title (max 5 words). Use snake_case or kebab-case if appropriate for code, or Title Case for prose.
    4. Description: A concise summary of what this prompt does (max 15 words). Focus on the capability or output.
    
    Example (${languageName}):
    Content: "..."
    Title: "..."
    Description: "..."
  `;

  try {
    console.log(`[ForgeAI] Generating metadata in ${languageName}...`);
    const { object } = await generateObject({
      model: ollama("qwen2.5:1.5b"),
      schema: z.object({
        title: z.string().describe("Short, punchy title for the prompt"),
        description: z
          .string()
          .describe("Concise description of the prompt's utility"),
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
