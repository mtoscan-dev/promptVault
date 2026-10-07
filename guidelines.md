---
name: premium-web-design
description: The default aesthetic system for BUILDING web pages and sites — Framer Motion animations, glassmorphism, multi-layered backgrounds, Fortune 500 look. TRIGGER when actually building or restyling a website, landing page, or web app. DO NOT TRIGGER for design-decision research (styles/palettes/typography selection, UI code review — see ui-ux-pro-max), static art (canvas-design), or artifact theming (theme-factory).
---

# Premium Web Design Skill

**DO NOT MAKE BLAND, BORING WEBSITES. This is the DEFAULT aesthetic system when building web pages.** (For choosing styles/palettes/fonts or reviewing UI code, consult ui-ux-pro-max; the two compose — ui-ux-pro-max decides, this skill builds.)

## Purpose

This skill documents the **premium enterprise design system** that creates modern, professional websites that look like Fortune 500 companies built them - NOT basic Wix templates.

## When to Use This Skill

Use this approach when building any website, landing page, or web application unless explicitly told otherwise. It governs HOW pages get built; ui-ux-pro-max is the reference for WHICH design direction to pick.

## The Problem This Solves

**Before (Default Behavior):**
- Flat, static designs with no depth
- Basic cards with simple borders
- No animations or micro-interactions
- Generic color schemes (often purple/pink)
- Looks like a PDF document or basic template
- No visual hierarchy or excitement
- Boring, unprofessional appearance

**After (This Skill):**
- Multi-layered, dynamic designs with depth
- Animated elements with smooth transitions
- Premium color gradients and effects
- Professional Fortune 500 aesthetic
- Eye-catching, modern, memorable
- Clear visual hierarchy and flow
- Trust-building, conversion-optimized

---

## Core Design Principles

### 1. NEVER Start with Flat Designs

**❌ DON'T:**
```tsx
<div className="bg-white p-4 border rounded">
  <h2>Service Title</h2>
  <p>Description text</p>
</div>
```

**✅ DO:**
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-orange-500/10 border-2 border-primary/30 backdrop-blur-xl overflow-hidden"
>
  {/* Animated background orb */}
  <motion.div
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 8, repeat: Infinity }}
    className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
  />

  <div className="relative">
    <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
      Service Title
    </h2>
    <p className="text-lg text-foreground/80">Description text</p>
  </div>
</motion.div>
```

---

### 2. ALWAYS Use Framer Motion for Animations

**Required Installation:**
```bash
npm install framer-motion
```

**Essential Animation Patterns:**

**A. Entrance Animations**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.8 }}
>
  {content}
</motion.div>
```

**B. Hover Effects**
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  whileTap={{ scale: 0.95 }}
>
  {content}
</motion.div>
```

**C. Continuous Animations (Background Orbs)**
```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
/>
```

**D. Staggered Animations (Lists)**
```tsx
{items.map((item, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

---

### 3. Multi-Layered Backgrounds (ESSENTIAL)

**Never use solid backgrounds. ALWAYS layer:**

```tsx
<section className="relative min-h-screen overflow-hidden">
  {/* Layer 1: Base gradient or image */}
  <div className="absolute inset-0">
    <img src="/bg.jpg" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-black/95" />
  </div>

  {/* Layer 2: Animated gradient orbs */}
  <motion.div
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 8, repeat: Infinity }}
    className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"
  />
  <motion.div
    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"
  />

  {/* Layer 3: Grid pattern overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />

  {/* Layer 4: Content with high z-index */}
  <div className="relative z-10">
    {content}
  </div>
</section>
```

**⚠️ SECTION RHYTHM — NO MONOTONE PAGES (as essential as the layering itself):**
Multi-layering every section over the SAME dark base produces a monotone "dark hole" — one continuous dark sheet with dark containers. The layers make a section rich; the BAND CHANGES make the page alive. Rules:
- **Adjacent sections must NEVER share the same background.** Rotate ≥3 visibly distinct band treatments down the page: base color · tinted/elevated band · inverted contrast band · accent wash · full-bleed image band with overlay.
- **At least one INVERTED band per page** — a warm off-white/light band on a dark site (testimonials or process are natural spots), a deep navy/charcoal band on a light site (trust bar, CTA).
- **Thumbnail test:** zoom out — every section boundary must be obvious. One continuous dark sheet or bright white sheet = failed design, no matter how many orbs and gradients are in it.
- **Cards contrast against their band** — never a dark glass card on a dark band or a white card on a white band.

---

### 4. Professional Color System

**❌ DON'T use pastels or generic colors:**
- `bg-purple-200` - Too soft, unprofessional
- `bg-pink-300` - Childish
- Solid colors without gradients - Boring

**✅ DO use rich gradients:**

**Primary (Orange/Red) - Action, Energy:**
```tsx
className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20"
className="text-primary" // oklch(0.55 0.25 15) - Vibrant red/orange
```

**Secondary (Blue/Cyan) - Trust, Technology:**
```tsx
className="bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20"
className="text-blue-400"
```

**Accent (Purple/Pink) - Premium, Modern:**
```tsx
className="bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-pink-500/20"
className="text-purple-400"
```

**Backgrounds:**
```tsx
// Dark sections
className="bg-gradient-to-br from-slate-900 via-gray-900 to-black"

// Card backgrounds with glassmorphism
className="bg-background/50 backdrop-blur-xl border-2 border-primary/30"
```

---

### 5. Typography That Commands Attention

**❌ DON'T use small, timid text:**
```tsx
<h1 className="text-2xl">Heading</h1> // Too small!
```

**✅ DO use BOLD, LARGE typography:**
```tsx
<h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1]">
  <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
    EXTEND YOUR
    <br />
    ROOF LIFE
  </span>
  <br />
  <span className="text-foreground">20 YEARS</span>
</h1>
```

**Font Size Guidelines:**
- Hero H1: `text-7xl` to `text-8xl` (72px-96px)
- Section H2: `text-5xl` to `text-6xl` (48px-60px)
- Card Titles: `text-3xl` to `text-4xl` (30px-36px)
- Body: `text-lg` to `text-xl` (18px-20px)
- Always use `font-black` (900 weight) for headings

---

### 6. Glassmorphism & Backdrop Effects

**Essential for modern premium look:**

```tsx
className="bg-gradient-to-br from-primary/10 to-orange-500/10 backdrop-blur-xl border-2 border-primary/30"
```

**Components:**
- `backdrop-blur-xl` - Frosted glass effect
- Semi-transparent backgrounds (`/10`, `/20`, `/30`)
- Subtle borders with opacity
- Layered depth

---

### 7. Card Design Patterns

**❌ Basic Card (NEVER use):**
```tsx
<div className="bg-white p-4 border rounded shadow">
  Content
</div>
```

**✅ Premium Card (ALWAYS use):**
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  className="group relative rounded-3xl overflow-hidden"
>
  {/* Background image with overlay */}
  <div className="absolute inset-0">
    <img src="/service.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
  </div>

  {/* Content */}
  <div className="relative p-8 md:p-10 min-h-[520px]">
    {/* Icon with animation */}
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
      <Icon className="w-10 h-10 text-orange-400" />
    </div>

    <h3 className="text-4xl font-black mb-3">{title}</h3>
    <p className="text-lg text-foreground/80 mb-6">{description}</p>

    {/* Features with staggered animation */}
    <div className="space-y-3">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2"
          style={{ transitionDelay: `${idx * 50}ms` }}
        >
          <Check className="w-5 h-5 text-orange-400" />
          <span>{feature}</span>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>
```

---

### 8. Floating Elements & 3D Effects

**Card Stack Pattern:**
```tsx
<div className="relative w-full h-[600px]">
  {/* Card 3 - Background */}
  <motion.div
    animate={{ y: [0, -10, 0], rotate: [-2, 0, -2] }}
    transition={{ duration: 6, repeat: Infinity }}
    className="absolute top-12 right-0 w-[420px] h-[520px] rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/30 shadow-2xl transform rotate-[-6deg]"
  />

  {/* Card 2 - Middle */}
  <motion.div
    animate={{ y: [0, -15, 0], rotate: [2, 0, 2] }}
    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
    className="absolute top-6 right-0 w-[420px] h-[520px] rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-2 border-blue-500/30 shadow-2xl transform rotate-[3deg]"
  />

  {/* Card 1 - Front */}
  <motion.div
    animate={{ y: [0, -20, 0] }}
    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
    className="absolute top-0 right-0 w-[420px] h-[520px] rounded-3xl bg-gradient-to-br from-primary/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl border-2 border-primary/40 shadow-2xl p-8"
  >
    {content}
  </motion.div>
</div>
```

---

### 9. Button Styling

**❌ Basic Button:**
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click Me
</button>
```

**✅ Premium Button:**
```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button
    size="lg"
    className="text-xl px-10 py-8 font-black bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary shadow-2xl shadow-primary/50 group"
  >
    <Phone className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
    CALL NOW
    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
  </Button>
</motion.div>
```

**Key Features:**
- Large padding (`px-10 py-8`)
- Gradient backgrounds
- Icon animations on hover
- Shadow effects (`shadow-2xl shadow-primary/50`)
- Motion wrapper for scale effects
- ALL CAPS text with `font-black`

---

### 10. Spacing & Layout

**Use generous spacing:**

```tsx
// Sections
className="py-24 md:py-32" // Not py-8!

// Cards
className="p-8 md:p-10" // Not p-4!

// Container
className="container mx-auto px-4 max-w-7xl"

// Gaps
className="gap-8" // Not gap-4!
className="space-y-12" // Not space-y-4!
```

---

### 11. Micro-Interactions (CRITICAL)

**Add these to EVERY interactive element:**

```tsx
// Hover scale + lift
whileHover={{ scale: 1.05, y: -5 }}

// Tap feedback
whileTap={{ scale: 0.95 }}

// Icon rotation on hover
className="group-hover:rotate-12 transition-transform"

// Slide on hover
className="group-hover:translate-x-2 transition-transform"

// Glow effect on hover
className="hover:shadow-2xl hover:shadow-primary/50 transition-all"
```

---

## Complete Hero Section Template

**Copy this for ANY hero section:**

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { Phone, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Multi-layered Background */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <img
          src="/hero-bg.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-black/95" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-[128px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-[128px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-orange-500/20 to-primary/20 border-2 border-primary/40 mb-8 backdrop-blur-xl"
              >
                <span className="text-sm font-black text-primary uppercase tracking-wider">
                  Your Badge Text
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1]"
              >
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                  YOUR MAIN
                  <br />
                  HEADLINE
                </span>
                <br />
                <span className="text-foreground">IMPACT WORD</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-10"
              >
                Your compelling description with <span className="text-primary font-bold">highlighted benefits</span>
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="text-xl px-10 py-8 font-black bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary shadow-2xl shadow-primary/50 group">
                    <Phone className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                    PRIMARY CTA
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="text-xl px-10 py-8 font-black border-2 border-primary/50 bg-background/5 hover:bg-primary/10 backdrop-blur-xl group">
                    SECONDARY CTA
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:block hidden"
            >
              {/* Add floating cards, images, or other visual elements */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## Services/Features Section Template

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const services = [
  {
    icon: IconComponent,
    title: "Service Name",
    shortDesc: "One-line benefit",
    description: "Detailed description",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    price: "$X,XXX",
    image: "/service-bg.jpg",
    gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
    glowColor: "orange",
    badge: "MOST POPULAR" // Optional
  },
  // ... more services
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 mb-8 backdrop-blur-sm"
          >
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Section Label
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            SECTION HEADING
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl leading-relaxed opacity-80 max-w-3xl mx-auto"
          >
            Section description with <span className="text-primary font-bold">highlighted text</span>
          </motion.p>
        </div>

        {/* Services Grid - 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${
                  isHovered ? 'scale-[1.02] z-10' : 'scale-100'
                }`}
              >
                {/* Background image with overlay */}
                <div className="absolute inset-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-8 md:p-10 min-h-[520px] flex flex-col">
                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-8 right-8">
                      <div className="px-4 py-2 bg-primary text-white text-xs font-black rounded-full shadow-lg shadow-primary/50 animate-pulse">
                        {service.badge}
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 transition-all duration-500 ${
                    isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                  } shadow-2xl`}>
                    <Icon className={`w-10 h-10 text-${service.glowColor}-400`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-primary font-bold text-lg mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Description */}
                  <p className="text-foreground/80 leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 transition-all duration-300 ${
                          isHovered ? 'translate-x-2' : 'translate-x-0'
                        }`}
                        style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                        <div className={`w-6 h-6 rounded-full bg-${service.glowColor}-500/20 flex items-center justify-center`}>
                          <Check className={`w-4 h-4 text-${service.glowColor}-400`} />
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-black text-primary mb-1">
                      {service.price}
                    </div>
                    <div className="text-sm text-foreground/60">
                      Typical project cost
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full text-lg font-bold transition-all duration-300 ${
                      isHovered ? 'shadow-2xl shadow-primary/50 scale-105' : 'shadow-lg'
                    }`}
                  >
                    Learn More
                    <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                      isHovered ? 'translate-x-2' : 'translate-x-0'
                    }`} />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

---

## Checklist: Is Your Design Premium?

Before calling a design "done", verify:

- [ ] **Framer Motion installed** and used for animations
- [ ] **Section band rhythm** — no two adjacent sections share a background; ≥3 distinct band treatments; at least one inverted contrast band; page passes the zoomed-out thumbnail test (not one continuous dark or white sheet)
- [ ] **Multi-layered backgrounds** (image + gradient + orbs + grid)
- [ ] **Animated gradient orbs** in background (pulsing)
- [ ] **Glassmorphism** (`backdrop-blur-xl`) on cards/modals
- [ ] **Large, bold typography** (`text-7xl`, `font-black`)
- [ ] **Gradient text** on headings (`bg-clip-text text-transparent`)
- [ ] **Hover animations** on ALL interactive elements
- [ ] **Staggered entrance animations** for lists
- [ ] **3D effects** (card stacking, rotation, depth)
- [ ] **Rich color gradients** (not solid colors)
- [ ] **Generous spacing** (`py-32`, `p-10`, `gap-8`)
- [ ] **Shadow effects** (`shadow-2xl shadow-primary/50`)
- [ ] **Icon animations** on hover (rotate, translate)
- [ ] **Background images** with overlays
- [ ] **Micro-interactions** everywhere (scale, lift, glow)

**If ANY are missing, the design is not premium enough.**

---

## Text Measurement — Pretext

For layouts that need precise text measurement — virtualized lists, chat interfaces, auto-sizing cards, masonry grids, responsive multi-column text — use `@chenglou/pretext` instead of DOM reads.

```bash
pnpm add @chenglou/pretext
```

```tsx
import { prepare, layout } from '@chenglou/pretext'

// Measure text height without triggering layout reflow (~500x faster than getBoundingClientRect)
const prepared = prepare(cardText, '16px Inter')
const { height, lineCount } = layout(prepared, containerWidth, 24)
```

Use cases: variable-height list virtualization, shrink-to-fit chat bubbles (`walkLineRanges`), text-around-image flow (`layoutNextLine`), canvas/SVG text rendering (`layoutWithLines`). Full API: `/mnt/shared-skills/pretext/SKILL.md`

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Flat, Static Cards
```tsx
<div className="bg-white p-4 border">Content</div>
```

### ✅ Fix: Layered, Animated Cards
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-orange-500/10 backdrop-blur-xl border-2 border-primary/30"
>
  Content
</motion.div>
```

---

### ❌ Mistake 2: No Animations
```tsx
<div>Content appears instantly</div>
```

### ✅ Fix: Entrance Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  Content fades in smoothly
</motion.div>
```

---

### ❌ Mistake 3: Solid Color Backgrounds
```tsx
<section className="bg-gray-900">
```

### ✅ Fix: Multi-Layered Backgrounds
```tsx
<section className="relative">
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
    <motion.div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
    <div className="absolute inset-0 bg-[linear-gradient(...grid pattern...)]" />
  </div>
  <div className="relative z-10">Content</div>
</section>
```

---

### ❌ Mistake 4: Small Typography
```tsx
<h1 className="text-3xl">Heading</h1>
```

### ✅ Fix: Large, Bold Typography
```tsx
<h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
  HEADING
</h1>
```

---

### ❌ Mistake 5: No Hover Effects
```tsx
<button>Click Me</button>
```

### ✅ Fix: Interactive Micro-Animations
```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button className="group">
    Click Me
    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
  </Button>
</motion.div>
```

---

## TL;DR: The Premium Design Formula

```
Premium Website =
  Section Band Rhythm (no two adjacent sections same bg) +
  Framer Motion Animations +
  Multi-Layered Backgrounds +
  Glassmorphism +
  Rich Color Gradients +
  Large Bold Typography +
  Hover Micro-Interactions +
  3D Effects +
  Generous Spacing +
  Professional Images +
  Shadow Depth
```

**NEVER deliver a flat, boring website again. Use this skill EVERY TIME.**

---

## Quick Reference: Component Library

**Background Orbs:**
```tsx
<motion.div
  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
  transition={{ duration: 8, repeat: Infinity }}
  className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
/>
```

**Premium Card:**
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-orange-500/10 backdrop-blur-xl border-2 border-primary/30"
>
  {content}
</motion.div>
```

**Gradient Heading:**
```tsx
<h2 className="text-7xl font-black bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
  HEADING
</h2>
```

**Premium Button:**
```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button className="px-10 py-8 bg-gradient-to-r from-primary to-orange-600 shadow-2xl shadow-primary/50 font-black group">
    TEXT
    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
  </Button>
</motion.div>
```

---

## Canvas Page Mode (OpenVoiceUI)

When creating HTML pages for the **canvas system** (writing to `/app/runtime/canvas-pages/`), these rules OVERRIDE the framework references above:

### MANDATORY — NO EXTERNAL DEPENDENCIES
Canvas pages render inside a sandboxed iframe. External CDN scripts WILL FAIL.

- **NEVER** use `<script src="https://cdn.tailwindcss.com">` — Tailwind CDN is a JS runtime that breaks in iframes
- **NEVER** load Bootstrap, Material UI, or any external CSS/JS framework via CDN
- **NEVER** use `<script src="...">` for any external URL
- **Google Fonts `@import url(...)` inside `<style>` is OK** — it's CSS, not JS, and degrades gracefully

### ALL STYLES MUST BE INLINE CSS
Write all your CSS in a `<style>` tag in `<head>`. You can still use everything from this skill:
- Gradients, glassmorphism, backdrop-filter, animations, keyframes
- CSS custom properties (variables)
- Hover effects, transitions, transforms
- Grid, flexbox, responsive media queries

Just write the CSS yourself instead of relying on utility classes.

### REQUIRED BASE STYLES
Every canvas page must include:
```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  padding: 15px 15px 0 15px;
  color: #e2e8f0;
  background: #0a0a0a;
  font-family: 'Inter', -apple-system, sans-serif;
  min-height: 100vh;
}
h1, h2, h3 { color: #fff; }
```

### REFERENCE TEMPLATE
Copy `/home/node/.openclaw/workspace/canvas-template.html` as your starting point for any canvas page. It has the correct base structure, dark theme, responsive layout, and postMessage bridge pre-wired.

---

**Use:** ALWAYS for web design tasks
