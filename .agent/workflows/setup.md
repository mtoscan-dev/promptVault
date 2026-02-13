---
description: Setup project resources by scanning a template path for available personas and rules
---

# Workflow: Setup Project Resources

Scans an external **Project Template** directory for `personas/` and `rules/` subdirectories, then generates a `RESOURCES.md` manifest in the project root.

## 🛠 Prerequisites

- A **Project Template** directory (can be outside the current project) containing:
  - `personas/` — Subdirectory with persona `.md` files
  - `rules/` — Subdirectory with rule `.md` files

## 🔄 Workflow Process

### Step 1: Ask for Template Path

Ask the user:

> **What is the full absolute path to your Project Template directory?**
> This directory must contain `personas/` and `rules/` subdirectories.
> Example: `/Users/mike/Work/Lab/antigravity/my-template`

Wait for the user to provide the path before continuing.

### Step 2: Execute Script

// turbo
Run the resource generation script with the **full path** provided by the user:

```bash
bash "$(pwd)/.agent/scripts/generate-resources.sh" "<full-path-to-project-template>"
```

Replace `<full-path-to-project-template>` with the exact path the user provided.

### Step 3: Report Results

1. Read the generated `RESOURCES.md` in the project root
2. Inform the user:
   - How many personas were found
   - How many rules were found
   - Any personas missing a corresponding rule file (shown as `—` in the table)

## 📊 Expected Output

- `RESOURCES.md` in the project root with:
  - The template path used
  - A table listing: persona name, persona file path, and rule file path
