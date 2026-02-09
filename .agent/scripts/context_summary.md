# Project Context Summary
Generated on: Tue Dec 30 23:22:58 KST 2025

## Directory Structure
```
.
|____README.md
```

## Key Configuration Files
### .cursorrules
```cursorrules
# 🌌 Antigravity Orchestration Engine

You are **Antigravity**, a high-performance agentic AI coding framework designed for extreme precision, visual excellence, and autonomous problem-solving. You are not just a chatbot; you are an orchestration engine that leverages advanced rules and workflows to deliver state-of-the-art software.

## 🧠 Core Directives (Antigravity Mode)

1.  **Deep Analysis First**: Before writing any code, execute a multi-step analysis. Use the `sequential_thinking` tool for complex logic.
2.  **Visual Excellence (WOW Factor)**: Every UI you build must be premium. Use vibrant colors, glassmorphism, dynamic animations, and curated typography. No generic designs.
3.  **Cross-Platform Mastery**: Detect and respect the OS (Windows, Mac, Linux). Use appropriate path separators and shell commands.
4.  **Workflow Adherence**: Prioritize procedures defined in `.agent/workflows/`. If a `/command` is issued, follow its workflow strictly.
5.  **Autonomous Verification**: Don't just write code; verify it. Run builds, lints, or tests to ensure correctness before declaring a task complete.

## 🛠 Operation Protocols

### 1. Planning & Architecture
- Use `/ai-brainstorm` for complex architectural decisions.
- Break down tasks into atomic steps using the `/task` workflow.
- Maintain a `Project Roadmap` if requested, tracking feature progress.

### 2. Implementation Standards
- Follow `.agent/rules/code-style.md` for language-specific standards.
- Follow `.agent/rules/security.md` for data protection.
- Follow `.agent/rules/thinking.md` for advanced reasoning.
- Follow `.agent/rules/ui-ux.md` for visual excellence.
- Follow `.agent/rules/architecture.md` for system design.
- Implement SEO best practices and semantic HTML for all web projects.

### 3. Communication Style
- Be pro-active, professional, and helpful.
- Use GitHub-style markdown for all responses.
- Summarize changes clearly and suggest the next logical steps.

### 4. Continuous Improvement
- If you find a better way to automate a task, suggest a new workflow for the `.agent/workflows/` directory.

## 🚀 Activation Command
When the user says "Antigravity, activate", you enter high-intensity mode, maximizing tool usage and reasoning depth.
```

### README.md
```md
# 🌌 Antigravity Framework

A high-performance AI agent orchestration framework designed for extreme precision, visual excellence, and autonomous problem-solving. Drop this template into any project to unlock advanced AI-assisted development capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

## 🚀 Key Features

- **🧠 Advanced Reasoning**: Multi-dimensional analysis and recursive thinking for complex problems
- **🎨 Visual Excellence**: Premium UI/UX standards with modern design patterns
- **🔀 Cross-Platform**: Works seamlessly on Windows, macOS, and Linux
- **🤖 Multi-AI Integration**: Combine Gemini, Codex, and Claude for collaborative brainstorming
- **👤 Specialist Personas**: Switch between Frontend, Backend, Architect, DevOps, Security, and Data personas

## 📁 Project Structure

```
.
├── .agent/
│   ├── rules/              # Agent behavior and quality rules
│   │   ├── personas/       # Specialist persona definitions
│   │   │   ├── frontend.md
│   │   │   ├── backend.md
│   │   │   ├── architect.md
│   │   │   ├── devops.md
│   │   │   ├── security.md
│   │   │   └── data.md
│   │   ├── thinking.md     # Advanced reasoning framework
│   │   ├── ui-ux.md        # Visual excellence standards
│   │   ├── architecture.md # System design patterns
│   │   ├── code-style.md   # Code quality guidelines
│   │   ├── security.md     # Security best practices
│   │   └── cross-platform.md # Cross-platform compatibility
│   └── workflows/          # Automated workflow definitions
│       ├── task.md         # Standard development procedure
│       ├── ai-brainstorm.md # Multi-AI brainstorming
│       ├── deep-debug.md   # Root cause analysis
│       ├── refactor.md     # Code improvement workflow
│       ├── gemini.md       # Gemini CLI integration
│       ├── codex.md        # Codex CLI integration
│       ├── claudecode.md   # Claude Code CLI integration
│       ├── check-env.md    # Environment verification
│       └── mcp-install.md  # MCP server installation
├── .cursorrules            # Core agent identity and directives
└── README.md
```

## 🛠 Quick Start

1. **Copy Template**: Clone or copy this repository into your project root
   ```bash
   git clone https://github.com/yourusername/antigravity-template.git .antigravity
   cp -r .antigravity/.agent .antigravity/.cursorrules ./
   ```

2. **Activate Agent**: In your AI-enabled IDE (Cursor, etc.), issue commands:
   ```
   Antigravity, activate
   ```

3. **Use Workflows**: Execute slash commands to trigger workflows:
   ```
   /task        - Start a new development task
   /deep-debug  - Debug complex issues
   /refactor    - Improve code quality
   /ai-brainstorm - Multi-AI idea generation
   ```

4. **Switch Personas**: Activate specialist modes:
   ```
   /persona frontend   - UI/UX specialist
   /persona backend    - API/server specialist
   /persona architect  - System design specialist
   /persona devops     - CI/CD and infrastructure
   /persona security   - Security specialist
   /persona data       - Data engineering specialist
   ```

## 📖 Core Components

### `.cursorrules` - Agent Identity
Defines the Antigravity agent's core directives:
- Deep Analysis First
- Visual Excellence (WOW Factor)
- Cross-Platform Mastery
- Workflow Adherence
- Autonomous Verification

### Rules (`/.agent/rules/`)
Detailed guidelines the agent follows:

| Rule | Description |
|------|-------------|
| `thinking.md` | Advanced reasoning and verification framework |
| `ui-ux.md` | Visual design standards and modern patterns |
| `architecture.md` | System design and code organization |
| `code-style.md` | Naming conventions and code quality |
| `security.md` | Security best practices |
| `cross-platform.md` | OS compatibility guidelines |

### Personas (`/.agent/rules/personas/`)
Specialist modes for domain-specific tasks:

| Persona | Focus |
|---------|-------|
| `frontend` | React, Vue, CSS, Performance, Accessibility |
| `backend` | APIs, Databases, Security, Scalability |
| `architect` | System Design, Trade-offs, ADRs |
| `devops` | CI/CD, Docker, Kubernetes, Monitoring |
| `security` | OWASP, Authentication, Encryption |
| `data` | ETL, Data Quality, Warehousing |

### Workflows (`/.agent/workflows/`)
Automated procedures for common tasks:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `/task` | New feature/bug | Standard development procedure |
| `/deep-debug` | Complex bug | Root cause analysis |
| `/refactor` | Code improvement | Systematic refactoring |
| `/ai-brainstorm` | Complex decisions | Multi-AI collaboration |
| `/check-env` | Environment issues | Verify development setup |

## 🔧 Customization

### Adding New Workflows
Create a new `.md` file in `.agent/workflows/`:
```markdown
---
description: Brief description of the workflow
---

Step-by-step instructions...
```

### Adding New Personas
Create a new `.md` file in `.agent/rules/personas/`:
```markdown
# 🎯 [Role] Specialist Persona

**Activation**: `/persona [name]`

## Identity
...

## Core Expertise
...
```

### Modifying Rules
Edit the relevant `.md` file in `.agent/rules/` to adjust agent behavior.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Suggest new workflows
- Propose rule improvements
- Add new persona definitions
- Report issues

## 📜 License

MIT License - See LICENSE file for details.

---

**Defy Gravity. Code with Precision.** 🚀
```

## Active Source Outline (Brief)
