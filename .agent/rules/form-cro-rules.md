---
name: form-cro-rules
description: "Optimization framework for non-signup forms, emphasizing friction reduction and form health scoring."
---

# 📋 Form CRO Protocol Rule

Strict protocol for assessing form health, reducing cognitive load, and optimizing completion rates.

## 1. Form Health & Friction Index (Required)

Before giving recommendations, calculate this diagnostic score (0–100).

| Category                         | Weight |
| -------------------------------- | ------ |
| **Field Necessity & Efficiency** | 30     |
| **Value–Effort Balance**         | 20     |
| **Cognitive Load & Clarity**     | 20     |
| **Error Handling & Recovery**    | 15     |
| **Trust & Friction Reduction**   | 10     |
| **Mobile Usability**             | 5      |

**Health Bands:**

- **85–100**: High-Performing (Optimize incrementally)
- **70–84**: Usable with Friction (Optimization opportunities)
- **55–69**: Conversion-Limited (Structural issues)
- **<55**: Broken (Redesign required)

## 2. Core Principles

### Every Field Has a Cost

- **3 fields**: Baseline
- **4–6 fields**: -10–25% completion
- **7+ fields**: -25–50%+ completion

Fields must **earn their place**. If not used or acted upon, remove it.

### Reduce Cognitive Load First

- Clear labels and instructions.
- Logical ordering (easiest first: Name, Email).
- Avoid decision fatigue (Selects vs Radios).

## 3. Field-Level Optimization

| Field Category | Best Practices                                                        |
| -------------- | --------------------------------------------------------------------- |
| **Email**      | Single field, inline validation, typo correction, correct keyboard.   |
| **Name**       | Single "Name" field by default. Split only if operationally required. |
| **Phone**      | Optional unless critical. Explain _why_. Auto-format.                 |
| **Selects**    | Radios for <5 options. Searchable selects for long lists.             |
| **Free Text**  | Optional unless essential. Clear guidance on length/purpose.          |

## 4. Layout & Mobile Standards

- **Single Column**: Default layout to prevent eye zig-zag.
- **Top-Aligned Labels**: Always visible, not placeholders.
- **Mobile First**: Touch targets ≥44px. Correct input types (tel, email, number).
- **Inline Validation**: Trigger after interaction, not keystroke. Clear, human error messages.

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona              | Use Case                                                       |
| -------------------- | -------------------------------------------------------------- |
| `copywriting`        | Optimizing labels, help text, error messages, and CTA copy.    |
| `page-cro`           | Ensuring the page context justifies the form ask.              |
| `analytics-tracking` | Implementing field-level tracking (focus, completion, errors). |

### Collaboration Protocol

1. **Calculate Health Score**: Establish the baseline.
2. **Identify Bottlenecks**: Pinpoint where the score is lost (e.g., too many fields, confusing labels).
3. **Draft Solutions**: Propose fixes for each bottleneck.
4. **Consult**: If copy or tracking is complex, consult the respective persona.
