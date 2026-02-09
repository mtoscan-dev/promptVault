---
description: AI brainstorming session using Gemini, Codex, and Claude Code CLI - three AIs exchange opinions to generate ideas (unavailable models are automatically skipped)
---

This workflow combines `gemini`, `codex`, and `claudecode` for collaborative brainstorming.
**Unavailable CLIs are automatically skipped.**

## 🛠 Prerequisites

First, check the availability of each CLI tool:
```bash
# Availability check
command -v gemini >/dev/null 2>&1 && echo "✅ Gemini available" || echo "❌ Gemini not found"
command -v codex >/dev/null 2>&1 && echo "✅ Codex available" || echo "❌ Codex not found"  
command -v claude >/dev/null 2>&1 && echo "✅ Claude available" || echo "❌ Claude not found"
```

## 🔄 Workflow Process

### Phase 1: Draft Generation (Primary AI)

Generate a draft using the first available AI:

1. **Gemini** (try first)
   - Run `/gemini` to generate an initial design draft as the foundation for ideas.
   - If failed, proceed to next AI

2. **Codex** (if Gemini fails)
   - Run `/codex` to generate draft
   - If failed, proceed to next AI

3. **Claude Code** (if Codex fails)
   - Run `/claudecode` to generate draft

### Phase 2: Technical Review (Secondary AI)

Review using an AI not used in Phase 1:

1. **Select Reviewer**
   - Choose from available AIs excluding the one used in Phase 1
   - Review technical limitations, optimization strategies, implementation details

2. **Collect Feedback**
   - Document issues, improvements, alternative approaches

### Phase 3: Creative Enhancement (Tertiary AI)

If a third AI is available, provide additional perspectives:

1. **Multi-angle Review**
   - Explore overlooked perspectives or edge cases
   - Provide UX-focused feedback

### Phase 4: Final Integration

1. **Synthesize Results**
   - Combine outputs from all used AIs
   - Commonly suggested items get high priority
   - Conflicting opinions presented as comparison table

2. **Derive Action Plan**
   - Define concrete implementation steps
   - Estimate time for each step

## 📊 Output Format

```markdown
# 🧠 AI Brainstorming Results

## Participating AIs
- [x] Gemini: Draft generation
- [x] Codex: Technical review
- [ ] Claude: Not available (skipped)

## Key Ideas
...

## Technical Considerations
...

## Recommended Action Plan
1. ...
2. ...
```

## ⚠️ Error Handling

- If all AIs are unavailable: Switch to manual brainstorming mode
- If only some AIs are available: Proceed with available AIs and note in results
