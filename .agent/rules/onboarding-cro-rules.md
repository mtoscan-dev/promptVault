---
name: onboarding-cro-rules
description: Core principles and guidelines for designing effective user onboarding flows, activation strategies, and first-run experiences that drive time-to-value and long-term retention.
---

# 🚀 Onboarding CRO Rules

Guidelines for creating onboarding experiences that help users reach their "aha moment" quickly and establish habits that lead to long-term retention.

## 1. Core Principles

- **Time-to-Value Is Everything**: Remove every step between signup and experiencing core value. Consider: Can they experience value BEFORE signup?
- **One Goal Per Session**: Focus first session on one successful outcome. Don't try to teach everything at once. Save advanced features for later.
- **Do, Don't Show**: Interactive experiences beat tutorials. Doing the thing beats learning about the thing. Show UI in context of real tasks.
- **Progress Creates Motivation**: Show advancement, celebrate completions, make the path visible.

## 2. Defining Activation

### Find Your Aha Moment

The action that correlates most strongly with retention:

- What do retained users do that churned users don't?
- What's the earliest indicator of future engagement?
- What action demonstrates they "got it"?

**Examples by product type:**

- Project management: Create first project + add team member
- Analytics: Install tracking + see first report
- Design tool: Create first design + export/share
- Collaboration: Invite first teammate
- Marketplace: Complete first transaction

### Activation Metrics

- % of signups who reach activation
- Time to activation
- Steps to activation
- Activation by cohort/source

## 3. Onboarding Flow Design

### Immediate Post-Signup (First 30 Seconds)

**Options:**

1. **Product-first**: Drop directly into product
   - Best for: Simple products, B2C, mobile apps
   - Risk: Blank slate overwhelm

2. **Guided setup**: Short wizard to configure
   - Best for: Products needing personalization
   - Risk: Adds friction before value

3. **Value-first**: Show outcome immediately
   - Best for: Products with demo data or samples
   - Risk: May not feel "real"

**Whatever you choose:**

- Clear single next action
- No dead ends
- Progress indication if multi-step

### Onboarding Checklist Pattern

**When to use:**

- Multiple setup steps required
- Product has several features to discover
- Self-serve B2B products

**Best practices:**

- 3-7 items (not overwhelming)
- Order by value (most impactful first)
- Start with quick wins
- Progress bar/completion %
- Celebration on completion
- Dismiss option (don't trap users)

**Checklist item structure:**

- Clear action verb
- Benefit hint
- Estimated time
- Quick-start capability

Example:

```
☐ Connect your first data source (2 min)
  Get real-time insights from your existing tools
  [Connect Now]
```

### Empty States

Empty states are onboarding opportunities, not dead ends.

**Good empty state:**

- Explains what this area is for
- Shows what it looks like with data
- Clear primary action to add first item
- Optional: Pre-populate with example data

**Structure:**

1. Illustration or preview
2. Brief explanation of value
3. Primary CTA to add first item
4. Optional: Secondary action (import, template)

### Tooltips and Guided Tours

**When to use:**

- Complex UI that benefits from orientation
- Features that aren't self-evident
- Power features users might miss

**When to avoid:**

- Simple, intuitive interfaces
- Mobile apps (limited screen space)
- When they interrupt important flows

**Best practices:**

- Max 3-5 steps per tour
- Point to actual UI elements
- Dismissable at any time
- Don't repeat for returning users
- Consider user-initiated tours

### Progress Indicators

**Types:**

- Checklist (discrete tasks)
- Progress bar (% complete)
- Level/stage indicator
- Profile completeness

**Best practices:**

- Show early progress (start at 20%, not 0%)
- Quick early wins (first items easy to complete)
- Clear benefit of completing
- Don't block features behind completion

## 4. Multi-Channel Onboarding

### Email + In-App Coordination

**Trigger-based emails:**

- Welcome email (immediate)
- Incomplete onboarding (24h, 72h)
- Activation achieved (celebration + next step)
- Feature discovery (days 3, 7, 14)
- Stalled user re-engagement

**Email should:**

- Reinforce in-app actions
- Not duplicate in-app messaging
- Drive back to product with specific CTA
- Be personalized based on actions taken

### Push Notifications (Mobile)

- Permission timing is critical (not immediately)
- Clear value proposition for enabling
- Reserve for genuine value moments
- Re-engagement for stalled users

## 5. Engagement Loops

### Building Habits

- What regular action should users take?
- What trigger can prompt return?
- What reward reinforces the behavior?

**Loop structure:**
Trigger → Action → Variable Reward → Investment

**Examples:**

- Trigger: Email digest of activity
- Action: Log in to respond
- Reward: Social engagement, progress, achievement
- Investment: Add more data, connections, content

### Milestone Celebrations

- Acknowledge meaningful achievements
- Show progress relative to journey
- Suggest next milestone
- Shareable moments (social proof generation)

## 6. Handling Stalled Users

### Detection

- Define "stalled" criteria (X days inactive, incomplete setup)
- Monitor at cohort level
- Track recovery rate

### Re-engagement Tactics

1. **Email sequence for incomplete onboarding**
   - Reminder of value proposition
   - Address common blockers
   - Offer help/demo/call
   - Deadline/urgency if appropriate

2. **In-app recovery**
   - Welcome back message
   - Pick up where they left off
   - Simplified path to activation

3. **Human touch**
   - For high-value accounts: personal outreach
   - Offer live walkthrough
   - Ask what's blocking them

## 7. Measurement

### Key Metrics

- **Activation rate**: % reaching activation event
- **Time to activation**: How long to first value
- **Onboarding completion**: % completing setup
- **Day 1/7/30 retention**: Return rate by timeframe
- **Feature adoption**: Which features get used

### Funnel Analysis

Track drop-off at each step:

```
Signup → Step 1 → Step 2 → Activation → Retention
100%      80%       60%       40%         25%
```

Identify biggest drops and focus there.

## 8. Common Patterns by Product Type

### B2B SaaS Tool

1. Short setup wizard (use case selection)
2. First value-generating action
3. Team invitation prompt
4. Checklist for deeper setup

### Marketplace/Platform

1. Complete profile
2. First search/browse
3. First transaction
4. Repeat engagement loop

### Mobile App

1. Permission requests (strategic timing)
2. Quick win in first session
3. Push notification setup
4. Habit loop establishment

### Content/Social Platform

1. Follow/customize feed
2. First content consumption
3. First content creation
4. Social connection/engagement

## 9. Anti-Patterns to Avoid

### Onboarding Killers

- Too many steps before value
- Forcing email verification before experience
- Tutorial overload (walls of text)
- No clear next action
- Blocking features behind completion

### Engagement Destroyers

- Overwhelming with features
- No progress indication
- Dead-end empty states
- Intrusive tours that can't be dismissed
- Asking for too much upfront

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona               | Use Case                                       |
| --------------------- | ---------------------------------------------- |
| `signup-flow-cro`     | For registration and signup optimization       |
| `email-sequence`      | For onboarding email series                    |
| `paywall-upgrade-cro` | For converting to paid during/after onboarding |
| `copywriting`         | For onboarding copy and microcopy              |
| `form-cro`            | For multi-step setup forms                     |

### Collaboration Protocol

1. **Identify need**: Determine if the task benefits from another persona's expertise
2. **Consult**: Use `/ask-persona [name] "[query]"` to get specialized input
3. **Wait**: Process the response before proceeding
4. **Integrate**: Apply insights into your work
