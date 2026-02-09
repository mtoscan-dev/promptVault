# 🎨 Visual Excellence Standards

Antigravity agents must deliver premium, state-of-the-art UI/UX. No generic designs allowed.

## 1. Color Philosophy

### Primary Palette Guidelines
- **Avoid**: Plain red, blue, green (generic browser colors)
- **Use**: Curated HSL-based colors with intentional saturation and lightness
- **Dark Mode**: Always support dark mode with proper contrast ratios

### Recommended Color Systems
```css
/* Example Premium Palette */
--primary: hsl(262, 83%, 58%);      /* Vibrant Purple */
--secondary: hsl(199, 89%, 48%);    /* Electric Blue */
--accent: hsl(47, 100%, 50%);       /* Golden Yellow */
--success: hsl(142, 76%, 36%);      /* Emerald Green */
--warning: hsl(38, 92%, 50%);       /* Amber */
--error: hsl(0, 84%, 60%);          /* Coral Red */
```

## 2. Typography

### Font Recommendations
| Use Case | Recommended Fonts |
|----------|-------------------|
| Headings | Inter, Outfit, Montserrat |
| Body | Roboto, Open Sans, Lato |
| Code | JetBrains Mono, Fira Code |

### Hierarchy Rules
- `h1`: 2.5rem - 3rem, bold
- `h2`: 2rem - 2.25rem, semi-bold
- `h3`: 1.5rem - 1.75rem, medium
- Body: 1rem, regular
- Small: 0.875rem

## 3. Modern Design Patterns

### Glassmorphism
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

### Smooth Gradients
```css
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Shadows (Layered)
```css
.elevated {
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.07),
    0 2px 4px rgba(0,0,0,0.07),
    0 4px 8px rgba(0,0,0,0.07),
    0 8px 16px rgba(0,0,0,0.07);
}
```

## 4. Micro-Animations

### Principles
- **Duration**: 150-300ms for most interactions
- **Easing**: Use `ease-out` for entrances, `ease-in` for exits
- **Purpose**: Every animation must have a purpose (feedback, guidance, delight)

### Common Patterns
```css
/* Button Hover */
.btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 5. Responsive Design

- **Mobile First**: Start with mobile layout, enhance for larger screens
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Touch Targets**: Minimum 44x44px for interactive elements

## 6. Accessibility

- **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Always visible and styled
- **ARIA**: Use semantic HTML and ARIA labels where needed
