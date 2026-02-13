---
description: Consult a specific persona with a direct question
---

# Workflow: Ask Persona

Consult a specialized persona for expert input on specific questions.

## Usage

```bash
/ask-persona [persona-name] "[question]"
```

**Example:**

```bash
/ask-persona architect "Should I use microservices or monolith for this feature?"
/ask-persona security "What authentication method is best for this API?"
```

## Available Personas

Check `.agent/rules/personas/` for the list of available personas:

- `architect` - System design, scalability, technology decisions
- `frontend` - UI/UX, components, styling, accessibility
- `backend` - APIs, databases, server logic, performance
- `security` - Authentication, authorization, vulnerabilities
- `devops` - CI/CD, containers, infrastructure
- `data` - Data pipelines, ETL, analytics
- `docker-expert` - Docker/Compose best practices
- `ai-architect` - AI/ML architecture and integration

## Process

1. **Load Persona**: Read `.agent/rules/personas/[persona-name].md`
2. **Activate Context**: Temporarily adopt persona's identity and expertise
3. **Process Question**: Analyze using persona's principles and response pattern
4. **Respond**: Return structured answer following persona's format
5. **Restore**: Return to previous context

## Response Format

The persona will respond using its defined response pattern from its persona file.

## Tips

- Be specific with your question
- Provide context if needed
- You can chain multiple `/ask-persona` calls to get different perspectives
