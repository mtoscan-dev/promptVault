---
description: Invoke Codex CLI for code analysis and technical review
---

This workflow directly calls the Codex CLI for technical code assistance.

## Prerequisites

Ensure the Codex CLI is installed and configured:
```bash
# Check availability
command -v codex >/dev/null 2>&1 && echo "✅ Codex available" || echo "❌ Codex not found"
```

## Usage

1. **Prepare Context**
   - Identify the code or problem to analyze
   - Gather relevant file paths or code snippets

2. **Execute CLI**
   ```bash
   codex "<your-query-or-task>"
   ```

3. **Review Output**
   - Analyze the technical recommendations
   - Validate suggested implementations
   - Consider performance implications

## Best Practices

- Provide specific file paths or code snippets
- Ask for performance analysis when relevant
- Request alternative approaches
- Verify all generated code
