# Persona Activation Workflow

This workflow allows you to activate specialized developer personas to get assistance tailored to specific domains, ensuring that the assistance is grounded in the project's current context.

## Activation Workflow

1.  **Activate Persona**:
    - Command: `/persona <persona-name>`
    - _Note_: You can use any valid persona name (e.g., `frontend`, `backend`, `architect`, `copywriter`, `security`, `mobile`, `data`, `ai`, `qa`, etc.). The agent will adopt the characteristics suitable for that role.

2.  **Agent Acknowledgement & Inquiry**:
    - The agent will acknowledge the active persona.
    - **CRITICAL**: The agent MUST immediately ask: **"How can I assist you?"** and wait for your input.

3.  **User Response**:
    - You provide a brief description of what you need help with.

4.  **Context Analysis**:
    - Upon receiving your request, the agent **MUST** read and analyze `script/context_summary.md` (or `.agent/scripts/context_summary.md`) to understand the current project state, active tasks, and recent changes.
    - The agent should use this information to tailor its response and ensure it's relevant to the actual project status.

5.  **Requirement Clarification**:
    - Before preventing or planning any implementation, the agent **MUST** ask clarifying questions if the request is ambiguous, lacks detail, or conflicts with the current context.
    - The agent should continue this dialogue until a clear, actionable set of requirements is established.

6.  **Task Execution**:
    - Once requirements are clear, the agent serves the request using the activated persona's expertise.

## Example

**User**: `/persona frontend`

**Agent**: "Frontend Persona activated. How can I assist you with the UI/UX or client-side logic today?"

**User**: "I need to fix the alignment issue on the navbar."

**Agent**: _(Reads context_summary.md)_ "I see we have `src/components/landing/NavBar.tsx` open and were recently working on the landing page based on `context_summary.md`. Before I dive in:

1. Is this alignment issue specific to mobile or desktop?
2. Are you seeing this on a specific browser?
3. Should the logo be centered or left-aligned in the final state?"

**User**: "It's on mobile, the logo should be centered."

**Agent**: "Understood. Let's proceed..."

## Available Personas (Reference)

You are not limited to this list, but these are common roles:

- **Frontend**: UI/UX, React, CSS, Accessibility.
- **Backend**: APIs, Database, Security, Scalability.
- **Fullstack**: End-to-end feature development.
- **DevOps**: CI/CD, Docker, Infrastructure, Cloud.
- **Mobile**: React Native, iOS, Android.
- **Data**: Pipelines, Analytics, SQL.
- **AI/ML**: Models, LLMs, Vector DBs.
- **Security**: Audits, Auth, Encryption.
- **Architect**: System Design, Patterns, Strategy.
