import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Use Ollama via OpenAI compatibility
const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_HOST + "/v1",
  apiKey: "ollama",
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama("qwen2.5:3b"),
    messages,
  });

  return result.toTextStreamResponse();
}
