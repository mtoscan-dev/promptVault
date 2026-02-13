---
name: signup-flow-cro-rules
description: Guidelines for auditing and optimizing signup and registration flows.
---

# 🚀 Signup Flow CRO Rule

Guidelines for identifying friction and optimizing signup flows to increase conversion rates.

## 1. Audit & Assessment

- Always verify the **Flow Type** (Free trial, Freemium, Paid, Waitlist) before recommending changes.
- Identify the **Primary CTA** and ensure it's prominently placed with clear, value-driven microcopy.
- Map the user journey from landing page → signup start → submission → success state.

## 2. Field Optimization Standards

| Field Type      | UX Standard                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| **Email**       | Single field, inline validation, check for common typos (gmial.com).                |
| **Password**    | Show requirements upfront, include visibility toggle, allow paste.                  |
| **Social Auth** | Group prominently above or below email; use relevant providers (Google/MS for B2B). |
| **Phone**       | Defer post-signup unless essential for verification. Explain why if required.       |

## 3. Implementation Design

### Multi-Step Progress

```tsx
// Pattern: Lead with low-friction inputs, save progress, show status.
const steps = [
  { id: "auth", fields: ["email", "password"], label: "Account" },
  { id: "profile", fields: ["name", "company"], label: "Profile" },
];
```

- **Step 1**: Capture Email/Password first to establish the lead.
- **Progress Bar**: Always show a progress indicator for flows with >3 steps.
- **Verification**: Delay email/SMS verification until after the user has seen the "Aha!" moment if possible.

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona          | Use Case                                                    |
| ---------------- | ----------------------------------------------------------- |
| `copywriting`    | Refining button labels and trust-building microcopy.        |
| `frontend`       | Implementing real-time validation and reactive UI states.   |
| `onboarding-cro` | Coordinating the handoff from registration to first-run UX. |

### Collaboration Protocol

1. **Identify need**: Determine if the task involves messaging (Copywriting) or complex UI implementation (Frontend).
2. **Consult**: Use `/ask-persona [name] "[query]"` to get specialized input.
3. **Wait**: Process the response before proceeding.
4. **Integrate**: Apply insights into your work.
