---
description: Standard procedure for starting new development tasks
---

Use this workflow when adding new features or fixing bugs.

## 1. Requirements Analysis

- Analyze the user's request and clarify implementation goals
- **Persona Discovery & Activation**: Read `RESOURCES.md` to identify and plan the activation of specialized personas for each specific sub-task.
- List affected existing files
- Identify dependencies and constraints

## 2. Design & Brainstorming

- Plan how to implement the solution
- Check for necessary libraries or tools
- Consider alternative approaches

## 3. Implementation Plan Report

- Before coding, summarize the implementation plan for user approval
- Include estimated effort and potential risks

## 4. Step-by-Step Implementation

- **Persona-Specific Execution**: For each atomic sub-task, activate the appropriate persona identified in `RESOURCES.md` (e.g., `/persona copywriting` for phrasing, `/persona frontend-design` for styling).
- **Cross-Persona Consultation**: The active persona can use the `/ask-persona` workflow (as defined in `ask-persona.md`) to consult specialists when required by its own rules or the task's complexity.
- Write code in small, atomic units following the active persona's specific rules and guidelines.
- Verify each step through builds or tests.
- Commit frequently with clear messages.

## 5. Final Review & Completion

- Summarize the work performed in `walkthrough.md`
- Include verification results (screenshots/logs)
- **REQUIRED**: Add a "Suggested Commit Message" section at the end of `walkthrough.md`
- Request user confirmation
- Document any follow-up tasks
