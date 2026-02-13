---
description: Create a new persona and rule by analyzing documents in @[new-agent]
---

# Workflow: Create New Agent (Persona & Rule)

This workflow analyzes files in `new-agent/agent/` to generate a new persona and files in `new-agent/rules/` to generate associated rules. **It exclusively leverages the `ai-agents-architect` persona for validation, safety checks, and autonomous system alignment.**

## 🛠 Prerequisites

1. Place persona reference files in `new-agent/agent/`.
2. Place new rule reference files in `new-agent/rules/` (optional).
3. Ensure templates `/.agent/templates/PERSONA.md` and `/.agent/templates/RULE.md` exist.
4. Ensure `/.agent/rules/personas/ai-agents-architect.md` exists for consultation.

## 📁 Directory Structure

```
new-agent/
├── agent/              ← Source files for the new persona
│   └── *.md / *.*
├── rules/              ← Source files for new rules
│   └── *.md / *.*
└── created/            ← Archive (auto-generated after creation)
    ├── agents/
    │   └── [persona-name]/   ← Moved agent source files
    └── rules/
        └── [persona-name]/   ← Moved rule source files
```

## 🔄 Workflow Process

### Phase 1: Analysis

1. **Scan Agent Content**: List and read files within `new-agent/agent/`.
2. **Extract Identity**: Identify the main purpose, tone, and expertise of the proposed agent.
3. **Identify Rules**: Extract core guidelines, coding patterns, or constraints that should be codified as a rule.
4. **Scan for New Rules**: Check if `new-agent/rules/` contains files.
   - If it does, list all files inside it
   - Read `RESOURCES.md` from the project root and check if each rule already exists in the **Rule File(s)** column
   - Mark rules as **skip** (already exists) or **create** (new rule needed)
   - Inform the user which rules will be created and which will be skipped (and why)
5. **Consult AI Architect (Pre-Task Validation)**:
   - `/ask-persona ai-agents-architect "Review the scope for this new [agent-name] agent. Is the proposed expertise well-defined and aligned with autonomous system principles?"`
   - Wait for the response before proceeding

### Phase 2: Generation

1. **Create Persona**:
   - Use `/.agent/templates/PERSONA.md` as the base.
   - **Extract Name**: Check if the source file in `new-agent/agent/` has a `name` or `title` field in the frontmatter or header. Use this as the persona name (lowercase, no spaces) for the filename.
   - Fill in the emoji, name, identity, expertise, and response pattern based on `new-agent/agent/` files.
   - **Consult During Creation**:
     - `/ask-persona ai-agents-architect "Review these principles for [new-agent]: [list principles]. Any gaps in autonomy or safety?"`
   - Define collaboration section: which personas this new agent can consult
   - **Add `### Rules` section** at the end of the persona file with the rule files the persona must follow strictly. Use this format:

     ```markdown
     ### Rules

     These rules must be followed strictly:

     - [rule-name-1].md
     - [rule-name-2].md
     ```

   - The rule filenames must correspond to `.md` files in the `rules/` directory of the project template
   - Save to `/.agent/rules/personas/[extracted-name].md`.

2. **Create Rule**:
   - Use `/.agent/templates/RULE.md` as the base.
   - **Extract Name**: Check if the agent source file defines a specific primary rule name. If not, use `[agent-name]-rules`.
   - Define the title, guidelines, and examples extracted from Phase 1.
   - **Consult During Creation**:
     - `/ask-persona ai-agents-architect "Review these guidelines for [rule-name]: [summary]. Are they robust and clear?"`
   - Define collaboration permissions: which personas can be consulted for rule validation
   - Save to `/.agent/rules/[extracted-name].md`.

3. **Generate New Rules** (if `new-agent/rules/` has files):
   - For each rule file marked as **create** in Phase 1 step 4:
     a. Read the source file from `new-agent/rules/[rule-name].md`
     b. **Extract Name**: Check for a `name` field or use the source filename.
     c. Use `/.agent/templates/RULE.md` as the base structure
     d. Fill in the title, sections, guidelines, and code examples based on the source file content
     e. Define collaboration permissions: which personas can consult this rule
     f. **Consult During Creation**:
     - `/ask-persona ai-agents-architect "Review these guidelines for [rule-name]: [summary]. Any autonomy risks?"`
       g. Save to `/.agent/rules/[extracted-name].md`
   - For each rule marked as **skip**:
     - Log: `⏭️ Skipping [rule-name].md — already exists in RESOURCES.md`
   - Inform the user of the results: which rules were created and which were skipped

### Phase 3: Integration

1. **Update Global Rules**: If necessary, reference the new rule in the project's global configuration. **(IMPORTANT: Do NOT update `RESOURCES.md` manually as it is managed by external scripts)**.
2. **Quality Validation (Post-Task)**:
   - `/ask-persona ai-agents-architect "Final review: Is the new [agent-name] persona well-structured and complete?"`
3. **Verification**: Confirm that the new persona and rule are correctly formatted and saved in the expected locations.

### Phase 4: Archive Source Files

After successful creation, move the source files to the archive:

1. **Move agent files**:
   - Create directory `new-agent/created/agents/[agent-name]/`
   - Move all files from `new-agent/agent/` → `new-agent/created/agents/[agent-name]/`

2. **Move rule files**:
   - Create directory `new-agent/created/rules/[agent-name]/`
   - Move all files from `new-agent/rules/` → `new-agent/created/rules/[agent-name]/`

3. **Confirm**: Inform the user that source files have been archived.

## 🤝 Persona Consultation Protocol

| Phase           | Consultation Purpose                   | Recommended Persona   |
| --------------- | -------------------------------------- | --------------------- |
| **Analysis**    | Validate scope, identify missing areas | `ai-agents-architect` |
| **Generation**  | Review principles, validate guidelines | `ai-agents-architect` |
| **Integration** | Quality check, technical accuracy      | `ai-agents-architect` |

### How to Consult

```bash
/ask-persona [persona-name] "[specific question]"
```

- Wait for the response before continuing
- If multiple personas are relevant, consult them sequentially
- Integrate feedback into your work before proceeding

## 📊 Expected Output

- A new persona file in `.agent/rules/personas/[name].md`
- A new rule file in `.agent/rules/[name].md`
- New rule files from `new-agent/rules/` (using extracted names)
- Source files archived in `new-agent/created/agents/[name]/` and `new-agent/created/rules/[name]/`
- Validation feedback from consulted personas documented in creation process
