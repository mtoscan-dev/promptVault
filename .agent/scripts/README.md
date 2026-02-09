# AntiGravity Automation Scripts

These scripts are designed to help you use AntiGravity (or any AI assistant) more efficiently by reducing token consumption and preparing the best possible context.

## Scripts Overview

### 1. Context Prepper
Generates a compact markdown summary of your project, including directory structure and key configuration files.
- **Mac/Linux:** `bash .agent/scripts/compact-context.sh`
- **Windows:** `powershell .agent/scripts/compact-context.ps1`
- **Result:** Creates `.agent/scripts/context_summary.md` which you can drag into the chat.

### 2. Token Optimizer
Identifies unusually large files (over 50KB) that might be bloating your AI's context window.
- **Mac/Linux:** `bash .agent/scripts/token-optimizer.sh`
- **Windows:** `powershell .agent/scripts/token-optimizer.ps1`
- **Goal:** Find "token leaks" in your project.

### 3. Setup AntiGravity (Linker)
Easily apply this template to **any other project**. When you clone this repository, you can run this script to copy all workflows, rules, and `.cursorrules` to your target development folder.
- **Mac/Linux:** Double-click or run `./setup-antigravity.sh` in the root.
- **Windows:** Right-click and "Run with PowerShell" `./setup-antigravity.ps1`.

## Why use these?

AI assistants like AntiGravity have a "context window." When you send too many large files (like entire libraries or huge logs), it:
1. Costs more tokens.
2. Increases the chance of the AI "forgetting" important details from earlier in the conversation.
3. Slows down responses.

By using these scripts, you provide a "high-resolution map" of your project without sending the "entire terrain" at once.

## How to use effectively

1. At the start of a new session, run `compact-context`.
2. Upload the `context_summary.md` and say: "Here is my project overview. Use this as background context."
3. Only provide the specific files you want to edit when needed.
