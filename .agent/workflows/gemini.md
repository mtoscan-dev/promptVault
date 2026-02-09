---
description: Invoke Gemini CLI for queries and result generation
---

This workflow directly calls the Gemini CLI for AI-powered assistance.

## Prerequisites

Ensure the Gemini CLI is installed and configured:
```bash
# Check availability
command -v gemini >/dev/null 2>&1 && echo "✅ Gemini available" || echo "❌ Gemini not found"
```

## Usage

1. **Prepare Query**
   - Formulate a clear and specific question or task
   - Include relevant context

2. **Execute CLI**
   ```bash
   gemini "<your-query>"
   ```

3. **Review Output**
   - Analyze the response
   - Extract actionable insights
   - Validate any code suggestions

## Best Practices

- Be specific in your queries
- Provide context about the project
- Ask for explanations, not just solutions
- Verify generated code before using
