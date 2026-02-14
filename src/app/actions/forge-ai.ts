"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
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
