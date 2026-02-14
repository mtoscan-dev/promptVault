"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateText } from "ai";
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
  const prompt = `
    You are a professional translator for technical AI prompts.
    Translate the following JSON fields to ${targetLang === "es" ? "Spanish" : "English"}.
    Keep the tone professional and technical.
    Return ONLY a valid JSON object with keys: title, description, content.
    Do not add markdown formatting or explanation.

    Input JSON:
    ${JSON.stringify(data)}
  `;

  try {
    const { text } = await generateText({
      model: ollama("qwen2.5:1.5b"),
      prompt,
      temperature: 0.3,
    });

    // Attempt to parse JSON
    // Cleanup potential markdown code blocks
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const result = JSON.parse(cleanText);

    return { success: true, data: result };
  } catch (error) {
    console.error("Translation Error:", error);
    return { success: false, error: "Translation failed" };
  }
}
