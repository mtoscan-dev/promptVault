---
description: Check the current development environment (OS, Node.js, Git, etc.) and output system information.
---

Use this workflow to verify the development environment setup.

## Environment Check Steps

1. **Operating System**
   ```bash
   uname -a
   # Or on Windows: systeminfo
   ```

2. **Runtime Versions**
   ```bash
   # Node.js (if applicable)
   node --version 2>/dev/null || echo "Node.js not installed"
   
   # Python (if applicable)
   python --version 2>/dev/null || python3 --version 2>/dev/null || echo "Python not installed"
   
   # Go (if applicable)
   go version 2>/dev/null || echo "Go not installed"
   
   # Rust (if applicable)
   rustc --version 2>/dev/null || echo "Rust not installed"
   ```

3. **Package Managers**
   ```bash
   # Node.js package managers
   npm --version 2>/dev/null || echo "npm not installed"
   yarn --version 2>/dev/null || echo "yarn not installed"
   pnpm --version 2>/dev/null || echo "pnpm not installed"
   
   # Python package managers
   pip --version 2>/dev/null || echo "pip not installed"
   
   # Other
   cargo --version 2>/dev/null || echo "cargo not installed"
   ```

4. **Version Control**
   ```bash
   git --version
   git config user.name
   git config user.email
   ```

5. **AI CLI Tools**
   ```bash
   command -v gemini >/dev/null 2>&1 && echo "✅ Gemini CLI" || echo "❌ Gemini CLI"
   command -v codex >/dev/null 2>&1 && echo "✅ Codex CLI" || echo "❌ Codex CLI"
   command -v claude >/dev/null 2>&1 && echo "✅ Claude CLI" || echo "❌ Claude CLI"
   ```

## Output

Summarize the environment status in a table format for easy review.
