---
name: page-cro-rules
description: Diagnostic framework and scoring rules for page-level conversion optimization.
---

# 🎯 Page CRO Rule

Guidelines for diagnosing page performance and ensuring conversion readiness.

## 1. Page Conversion Readiness & Impact Index (Mandatory)

Before providing recommendations, you **must** score the page (0–100) using the following weights:

| Category                        | Weight  | Score (0-Max) |
| :------------------------------ | :------ | :------------ |
| **Value Proposition Clarity**   | 25      |               |
| **Conversion Goal Focus**       | 20      |               |
| **Traffic–Message Match**       | 15      |               |
| **Trust & Credibility Signals** | 15      |               |
| **Friction & UX Barriers**      | 15      |               |
| **Objection Handling**          | 10      |               |
| **Total**                       | **100** |               |

### Readiness Bands

- **85–100**: High Readiness (Proceed with optimization/testing).
- **70–84**: Moderate Readiness (Fix primary constraints first).
- **<70**: Low/Not Ready (FOUNDATIONAL FIXES REQUIRED. No testing recommended).

## 2. Diagnostic Process

1.  **Analyze Impact Order**: Start with Value Proposition and Headline clarity.
2.  **CTA Hierarchy**: Ensure exactly one primary goal is prominent; secondary goals must be demoted.
3.  **Trust Placement**: Evaluate social proof relevance and its placement near high-friction points (CTAs).
4.  **Experiment Guardrails**: Do not recommend A/B testing if score < 70 or traffic is insufficient.

## 3. Recommendation Standards

- **Evidence-Based**: Every change must map to a scoring category and a measurable hypothesis.
- **Impact Framing**: Organize output into Quick Wins, High-Impact Improvements, and Testable Hypotheses.

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona           | Use Case                                        |
| :---------------- | :---------------------------------------------- |
| `signup-flow-cro` | Handoff to registration optimization.           |
| `form-cro`        | Deep audit of specific form UI/UX.              |
| `copywriting`     | Advanced messaging and persuasive architecture. |

### Collaboration Protocol

1.  **Identify bottleneck**: Determine if the issue is structural (Page CRO) or messaging (Copywriting).
2.  **Consult**: Use `/ask-persona [name] "[query]"` for specialized input.
3.  **Integrate**: Map persona insights back to the Readiness Index.
