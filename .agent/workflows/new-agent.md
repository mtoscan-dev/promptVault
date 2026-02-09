---
description: Create a new persona and rule by analyzing documents in @[new-agent]
---

# Workflow: Create New Agent (Persona & Rule)

This workflow analyzes files in the `new-agent/` directory to automatically generate a new persona and associated rule using standard templates.

## 🛠 Prerequisites

1. Place relevant documentation or reference files in `/Users/mike/Work/Proyectos/vault/new-agent/`.
2. Ensure templates `/.agent/templates/PERSONA.md` and `/.agent/templates/RULE.md` exist.

## 🔄 Workflow Process

### Phase 1: Analysis

1. **Scan Content**: List and read files within `/Users/mike/Work/Proyectos/vault/new-agent/`.
2. **Extract Identity**: Identify the main purpose, tone, and expertise of the proposed agent.
3. **Identify Rules**: Extract core guidelines, coding patterns, or constraints that should be codified as a rule.

### Phase 2: Generation

1. **Create Persona**:
   - Use `/.agent/templates/PERSONA.md` as the base.
   - Fill in the emoji, name, identity, expertise, and response pattern.
   - Save to `/.agent/rules/personas/[name].md`.

2. **Create Rule**:
   - Use `/.agent/templates/RULE.md` as the base.
   - Define the title, guidelines, and examples extracted from Phase 1.
   - Save to `/.agent/rules/[name].md`.

### Phase 3: Integration

1. **Update Global Rules**: If necessary, reference the new rule in the project's global configuration.
2. **Verification**: Confirm that the new persona and rule are correctly formatted and saved in the expected locations.

## 📊 Expected Output

- A new persona file in `.agent/rules/personas/`
- A new rule file in `.agent/rules/`