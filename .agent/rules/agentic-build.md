---
name: agentic-build
description: "Guidelines for building robust, autonomous agentic systems."
---

# 🤖 AI Agent Architecture Rule

Guidelines for building robust, autonomous agentic systems.

## 1. Core Patterns

### ReAct Loop

Reason-Act-Observe cycle for step-by-step execution.

- **Thought**: Reason about what to do next.
- **Action**: Select and invoke a tool.
- **Observation**: Process tool result.
- **Repeat**: Until task complete or stuck.
- **Constraint**: Always include max iteration limits.

### Plan-and-Execute

Plan first, then execute steps.

- **Planning phase**: Decompose task into steps (often using a stronger model).
- **Execution phase**: Execute each step (often using faster/cheaper models).
- **Replanning**: Adjust plan based on results; don't blindly follow a stale plan.

### Tool Registry

Dynamic tool discovery and management.

- Register tools with clear JSON schemas and examples.
- Use lazy loading for expensive tools.
- Track usage for optimization.

## 2. Anti-Patterns & Pitfalls

| Issue               | Severity | Solution                                                                    |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| **Agent loops**     | Critical | Always set max iteration limits.                                            |
| **Vague tools**     | High     | Write comprehensive tool descriptions and examples.                         |
| **Silent failures** | High     | Surface tool errors explicitly to the agent so it can recover.              |
| **Memory flooding** | Medium   | Use selective memory or summarization; don't stuff everything into context. |
| **Tool overload**   | Medium   | Curate tools per task; don't give an agent 100 tools it doesn't need.       |
| **God Agent**       | Medium   | Split complex tasks into specialized sub-agents or workflows.               |

## 3. Implementation Example

```typescript
// Example: Safe Tool Execution Wrapper
async function executeToolSafe(toolName: string, args: any, context: Context) {
  try {
    // 1. Validate permissions
    if (!context.canUse(toolName)) throw new Error("Permission denied");

    // 2. Execute with timeout
    const result = await withTimeout(tools[toolName](args), 10000);

    // 3. Log execution
    logger.info(`Tool ${toolName} executed`, { args, result });

    return result;
  } catch (error) {
    // 4. Return error as observation, don't crash
    logger.error(`Tool ${toolName} failed`, { error });
    return `Error executing ${toolName}: ${error.message}. Try a different approach.`;
  }
}
```

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona    | Use Case                                          |
| ---------- | ------------------------------------------------- |
| `backend`  | Implementing the tool logic and API integrations. |
| `security` | Reviewing tool permissions and sandboxing.        |

### Collaboration Protocol

1. **Identify need**: If the agent needs access to sensitive data or complex APIs.
2. **Consult**: Use `/ask-persona security "Is this tool definition safe?"`
3. **Integrate**: Apply security constraints to the tool definition.
