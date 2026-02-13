---
name: frontend-enhancer-rules
description: Standards for UI enhancement, visual design, and frontend code integrity.
---

# 🎨 Frontend Enhancer Rules

These rules define the standards for creating visually stunning, robust, and accessible user interfaces.

## 1. Visual Excellence & "WOW" Factor

- **Premium Aesthetic**: Avoid generic designs. Use curated color palettes, glassmorphism, and subtle gradients.
- **Dynamic Interaction**: Every interactive element must have clear `hover`, `active`, and `focus` states.
- **Micro-animations**: Use subtle transitions (e.g., `transition-all duration-200`) to make the UI feel alive.
- **Typography**: Enforce strict hierarchy. Use different weights and sizes to guide the user's eye.

## 2. Technical Implementation

- **Tailwind First**: Use utility classes for 99% of styling. Only use custom CSS for complex animations.
- **Component Reusability**: Do not duplicate styles. Extract common patterns into components or utility classes.
- **Utility Functions**: Use `cn()` (clsx + tailwind-merge) for all conditional class merging.
- **Mobile-First**: Define base styles for mobile, then use `sm:`, `md:`, `lg:` for larger screens.

## 3. The "Anti-Regression" Integrity Filter

Before finalizing ANY change, you must verify:

1.  **Code Block Check**: Did I accidentally delete any logic or event handlers?
2.  **Completeness**: Is the file complete? (No truncation at the end).
3.  **Functionality**: Do buttons and inputs still trigger their original actions?

## 4. Accessibility (a11y)

- **Contrast**: Ensure text meets WCAG AA standards.
- **Keyboard Nav**: All interactive elements must be reachable via Tab.
- **Semantic HTML**: Use `<main>`, `<nav>`, `<button>`, etc., correctly.
- **Reduced Motion**: Respect `prefers-reduced-motion` for complex animations.

## 5. Responsive Verification Plan

| Breakpoint | Width    | Check                                                       |
| :--------- | :------- | :---------------------------------------------------------- |
| Mobile     | < 640px  | No horizontal scroll. Touch targets > 44px. Stacked layout. |
| Tablet     | 768px    | legible padding. Grid columns adjust (e.g., 1 -> 2).        |
| Desktop    | > 1024px | Max-width constraints. Hovers enabled.                      |

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona               | Use Case                                                  |
| :-------------------- | :-------------------------------------------------------- |
| `ai-agents-architect` | Validating autonomy of new UI agents or complex workflows |
| `qa-engineer`         | Formal E2E testing of critical UI flows                   |

### Collaboration Protocol

1. **Identify need**: If a UI change affects business logic transparency.
2. **Consult**: Use `/ask-persona [name] "[query]"`.
3. **Verify**: Ensure the UI change didn't break the logic.
