---
name: frontend-design-rules
description: Rules for aesthetic execution, DFII scoring, and technical implementation of distinctive frontend interfaces.
---

# 🎨 Frontend Design Rule

This rule governs the creation of memorable, high-craft interfaces and the application of the DFII scoring system.

## 1. Design Feasibility & Impact Index (DFII)

Before execution, evaluate the direction using these dimensions (1–5):

| Dimension                      | Question                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| **Aesthetic Impact**           | How visually distinctive and memorable is this direction?    |
| **Context Fit**                | Does this aesthetic suit the product, audience, and purpose? |
| **Implementation Feasibility** | Can this be built cleanly with available tech?               |
| **Performance Safety**         | Will it remain fast and accessible?                          |
| **Consistency Risk**           | Can this be maintained across screens/components?            |

### Scoring Formula

```
DFII = (Impact + Fit + Feasibility + Performance) − Consistency Risk
```

_Range: -5 to +15_

### Interpretation

- **12–15**: Excellent. Execute fully.
- **8–11**: Strong. Proceed with discipline.
- **4–7**: Risky. Reduce scope or effects.
- **≤ 3**: Weak. Rethink aesthetic direction.

## 2. Aesthetic Execution Rules (Non-Negotiable)

- **Typography**: Avoid system fonts (Inter, Roboto, etc.) for display. Choose one expressive display font and one restrained body font.
- **Color**: Commit to a dominant color story. Use CSS variables. Avoid evenly-balanced palettes.
- **Spatial Composition**: White space is a design element. Break the grid intentionally (asymmetry, overlap).
- **Motion**: Purposeful, sparse, and high-impact. Duration: 150-300ms.
- **Differentiation Anchor**: If screened without a logo, the UI must still be recognizable.

## 3. Implementation Standards

- **Semantic HTML**: Use proper tags for accessibility and SEO.
- **Clean Code**: No dead styles or unused animations. Modular and readable.
- **Accessibility**: WCAG 2.1 AA compliance by default (contrast, focus states).
- **Complexity Matching**: Maximalist design requires sophisticated code; minimalist design requires surgical precision in spacing.

## 4. Technology Stack (Reference)

| Category        | Recommended Tools                                                             |
| --------------- | ----------------------------------------------------------------------------- |
| **Frameworks**  | Next.js, React, Svelte, Vue, Nuxt, Angular                                    |
| **Styling**     | Tailwind CSS, SCSS, Styled Components, CSS Modules                            |
| **State**       | Zustand, React Query, Redux, Pinia, Jotai                                     |
| **Build**       | Vite, Turbopack, Webpack, esbuild                                             |
| **Performance** | Core Web Vitals optimization, Code splitting, Image optimization (WebP, AVIF) |

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona                | Use Case                                             |
| ---------------------- | ---------------------------------------------------- |
| `copywriting`          | Aligning message rhythm with typography scale        |
| `marketing-psychology` | Aligning visual anchors with behavioral leverage     |
| `page-cro`             | Ensuring aesthetic doesn't harm conversion hierarchy |

### Collaboration Protocol

1. **Identify need**: Determine if the aesthetic choice impacts conversion or requires specific copy treatment.
2. **Consult**: Use `/ask-persona [name] "[query]"` to validate cross-domain impact.
3. **Integrate**: Adjust the DFII score or implementation based on feedback.
