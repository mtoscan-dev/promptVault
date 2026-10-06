// Embedding model is pinned (not DEFAULT_MODEL) so every vector has the same
// dimensionality — the DB column is a fixed vector(768). Must match the exact
// id freeLLMAPI reports at GET /v1/models for the loaded embedding model.
const EMBEDDING_MODEL = "nomic-embed-text";

export async function generateEmbedding(text: string): Promise<number[]> {
  const baseUrl = process.env.LLM_BASE_URL || "http://127.0.0.1:3001/v1";

  const res = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LLM_API_KEY
        ? { Authorization: `Bearer ${process.env.LLM_API_KEY}` }
        : {}),
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Embedding request failed (${res.status}): ${body || res.statusText}`,
    );
  }

  const data = await res.json();
  return data.data[0].embedding as number[];
}
