---
name: popup-cro-rules
description: "Optimization framework for popups and modals, focusing on trigger strategy, UX respect, and SEO safety."
---

# 🗯️ Popup CRO Protocol Rule

Strict protocol for designing and optimizing interruptive UI patterns without damaging UX or SEO.

## 1. Initial Assessment Requirements

Before proposing a popup, you MUST answer:

- **Single Purpose**: What is the one job this popup does?
- **Current State**: Existing popups, conversion rates, and mobile behavior.
- **Context**: Traffic source, funnel stage, and new vs returning status.

## 2. Core Operational Principles

- **Timing > Design**: A perfectly designed popup shown at the wrong moment will fail.
- **Immediate Value**: The user must understand why the interruption is worth it in under 3 seconds.
- **Respectful Interruption**: Easy dismissal (X, ESC, click-outside) is mandatory.
- **One Popup, One Job**: No mixed goals or secondary CTAs.

## 3. Trigger & Selection Strategy

| Trigger Type          | Best Use Case             | Logic                                                     |
| --------------------- | ------------------------- | --------------------------------------------------------- |
| **Scroll-Based**      | Blogs, long content       | Fire at 25–50% depth.                                     |
| **Exit Intent**       | E-commerce, lead recovery | Fire on cursor exit (desktop) or back/scroll up (mobile). |
| **Active Engagement** | List building             | Fire after 30–60s of active time (never < 5s).            |
| **Click-Triggered**   | Lead magnets              | Fire on user action. Zero interruption cost.              |

## 4. Constraint & Exclusion Rules

### Hard Exclusions

- **Do NOT** show popups during checkout, signup flows, or critical conversion steps.
- **SEO Safety**: Avoid intrusive full-screen interstitials on mobile entry (Google Compliance).

### Frequency Capping

- Max once per session.
- Respect dismissals (7–30 day cooldown).

## 5. Mobile & Accessibility Standards

- **Touch Targets**: Minimum 44px for all interactive elements.
- **Dismissal**: Must have a visible close button and support "click outside to close".
- **Focus Management**: Focus must be trapped within the modal while open.
- **Visual Pattern**: Bottom slide-ups are preferred over full-screen blockers on mobile.

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona       | Use Case                                                     |
| ------------- | ------------------------------------------------------------ |
| `form-cro`    | Optimizing the input fields and validation inside the popup. |
| `copywriting` | Refining the headline hooks and first-person CTA copy.       |
| `page-cro`    | Aligning the popup with the high-level page objective.       |

### Collaboration Protocol

1. **Strategy Alignment**: Ensure the popup doesn't conflict with the page's primary goal.
2. **Copy Review**: Validate that the value prop is immediate (< 3s).
3. **Trigger Implementation**: Define exact logic based on engagement metrics.
4. **Validation**: Run accessibility/compliance check.
