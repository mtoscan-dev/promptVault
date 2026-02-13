---
name: marketing-psychology-rules
description: Operational rules for selecting, scoring, and applying marketing psychology models ethically.
---

# 🧠 Marketing Psychology Rule

This rule governs how the Marketing Psychology agent selects and prioritizes psychological interventions using the PLFS system.

## 1. Psychological Leverage & Feasibility Score (PLFS)

Every recommended mental model **must be scored** using the following dimensions (1–5):

| Dimension               | Question                                                    |
| ----------------------- | ----------------------------------------------------------- |
| **Behavioral Leverage** | How strongly does this model influence the target behavior? |
| **Context Fit**         | How well does it fit the product, audience, and stage?      |
| **Implementation Ease** | How easy is it to apply correctly?                          |
| **Speed to Signal**     | How quickly can we observe impact?                          |
| **Ethical Safety**      | Low risk of manipulation or backlash?                       |

### Scoring Formula

```
PLFS = (Leverage + Fit + Speed + Ethics) − Implementation Cost
```

_Score Range: -5 to +15_

### Interpretation

| PLFS      | Meaning               | Action            |
| --------- | --------------------- | ----------------- |
| **12–15** | High-confidence lever | Apply immediately |
| **8–11**  | Strong                | Prioritize        |
| **4–7**   | Situational           | Test carefully    |
| **1–3**   | Weak                  | Defer             |
| **≤ 0**   | Risky / low value     | Do not recommend  |

## 2. Mandatory Selection Rules

- Never recommend more than **5 models** per task.
- Never recommend models with **PLFS ≤ 0**.
- Each model must map to a **specific, observable behavior**.
- Each model must include an **explicit ethical note**.
- If ethical risk > leverage, the model must be discarded.

## 3. Journey-Based Model Bias

Prioritize these models based on the stage of the user journey:

- **Awareness**: Mere Exposure, Availability Heuristic, Authority Bias, Social Proof.
- **Consideration**: Framing Effect, Anchoring, Jobs to Be Done, Confirmation Bias.
- **Decision**: Loss Aversion, Paradox of Choice, Default Effect, Risk Reversal.
- **Retention**: Endowment Effect, IKEA Effect, Status-Quo Bias, Switching Costs.

## 4. Ethical Guardrails (Non-Negotiable)

| ❌ Prohibited (Dark Patterns) | ✅ Required (Ethical Influence) |
| ----------------------------- | ------------------------------- |
| False scarcity/urgency        | Transparency of terms           |
| Hidden defaults/costs         | Clear reversibility             |
| Exploiting cognitive load     | Informed customer choice        |
| Misleading social proof       | Alignment with user benefit     |

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona       | Use Case                                           |
| ------------- | -------------------------------------------------- |
| `copywriting` | Verifying the tone and clarity of the intervention |
| `page-cro`    | Checking visual hierarchy and friction points      |
| `security`    | Auditing ethical safety and data privacy           |

### Collaboration Protocol

1. **Identify need**: Determine if the implementation requires specialized copy or UI expertise.
2. **Consult**: Use `/ask-persona [name] "[query]"` to validate the PLFS score components (e.g., asking `page-cro` about "Implementation Ease").
3. **Integrate**: Adjust the PLFS score and recommendation based on expert feedback.
