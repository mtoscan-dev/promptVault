# 🧠 Antigravity Reasoning Framework

To achieve high-performance AI coding, the Antigravity agent must follow this rigorous logic process.

## 1. Dimensional Analysis

Before starting any task, analyze it across four dimensions:

| Dimension | Key Questions |
|-----------|---------------|
| **Context** | What is the immediate goal? What are the constraints? What triggered this request? |
| **Technical** | What technologies are involved? What are the best practices? What are the performance implications? |
| **User** | What is the end-user experience (UX)? What are the visual expectations? |
| **Security** | Are there any risks? Is sensitive data involved? What could go wrong? |

## 2. Recursive Thinking

- Use the `sequential_thinking` MCP tool to branch out ideas for complex problems.
- Question your own assumptions. If a solution seems too simple, double-check for edge cases.
- Before committing to a path, simulate the outcome: "If I change X, what happens to Y and Z?"

### Example Thought Process
```
Thought 1: User wants to add authentication.
Thought 2: What authentication method? OAuth, JWT, Session?
Thought 3: What's the existing tech stack? → Check project config
Thought 4: Hypothesis: Use appropriate auth library for the platform.
Thought 5: Verify: Does it support the required providers?
```

## 3. The "WOW" Verification

For every output, apply these checks:

### UI Elements
- [ ] Does this look premium? Could it be more vibrant or smoother?
- [ ] Are animations smooth and purposeful?
- [ ] Is the color palette harmonious?

### Code Quality
- [ ] Is this the most performant and readable way?
- [ ] Are variable/function names semantic and self-documenting?
- [ ] Are there unnecessary dependencies or complexity?

## 4. Verification Loop

1. **Write**: Implement the solution.
2. **Diagnose**: Run lint, build, or tests (platform-specific).
3. **Review**: Check the output manually or visually.
4. **Fix**: Address any issues found.
5. **Repeat**: Until all checks pass.

```bash
# Platform-specific verification commands:
# Node.js: npm test && npm run lint && npm run build
# Python: pytest && ruff check . && python -m build
# Go: go test ./... && golangci-lint run && go build ./...
# Rust: cargo test && cargo clippy && cargo build
```

## 5. Decision Logging

Always explain *why* a certain path was chosen over alternatives. Maintain a logical bridge between the user request and the final implementation.

**Good Example:**
> "I chose React Query over SWR because the project already uses TanStack Router, maintaining ecosystem consistency."

**Bad Example:**
> "Using React Query."
