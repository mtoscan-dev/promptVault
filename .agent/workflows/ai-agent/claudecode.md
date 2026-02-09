---
description: Invoke Claude Code CLI for code analysis, modifications, and queries
---

This workflow directly calls the Claude Code CLI for AI-powered coding assistance.

## Prerequisites

Ensure the Claude Code CLI is installed and configured:
```bash
# Check availability
command -v claude >/dev/null 2>&1 && echo "✅ Claude available" || echo "❌ Claude not found"
```

## Usage

1. **Prepare Task**
   - Define the code task or question clearly
   - Include relevant context and constraints

2. **Execute CLI**
   ```bash
   claude "<your-query-or-task>"
   ```

3. **Review Output**
   - Analyze the response and suggestions
   - Validate code modifications
   - Check for potential issues

## Best Practices

- Be specific about what you want to achieve
- Provide context about the codebase
- Request explanations for complex changes
- Always review generated code before applying
