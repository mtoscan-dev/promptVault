---
name: ai-architect
description: "Guidelines for building reliable, production-ready AI features in PromptVault."
---

# 🤖 AI Architect Rule

Guidelines for building reliable, production-ready AI features in PromptVault.

## 1. Structured Outputs & Validation

- ALWAYS use JSON mode or function calling with strict schema validation.
- NEVER trust LLM output blindly; implement a validation layer for all business-critical logic.

## 2. AI UI/UX Patterns

| Pattern             | Requirement                       | Benefit                   |
| ------------------- | --------------------------------- | ------------------------- |
| Streaming           | Show incremental progress         | Reduced perceived latency |
| Progress Indicators | Visual feedback during processing | User trust and engagement |
| Fact-Checking       | Cross-reference factual claims    | Mitigates hallucinations  |

## 3. Implementation Guardrails

```typescript
// Always validate LLM responses against a schema
import { z } from "zod";

const ResponseSchema = z.object({
  content: z.string(),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
});

async function processAIResponse(rawJson: string) {
  try {
    const validated = ResponseSchema.parse(JSON.parse(rawJson));
    return validated;
  } catch (error) {
    console.error("AI Validation Failed", error);
    // Fallback logic here
  }
}
```

## 4. Cost and Token Management

- Calculate tokens before sending requests to avoid window stuffing.
- Use semantic caching for frequent queries to reduce API costs.
- Prioritize smaller models (e.g., 4o-mini) for routing and simple classification.
