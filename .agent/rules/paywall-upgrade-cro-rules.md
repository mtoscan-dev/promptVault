---
name: paywall-upgrade-cro-rules
description: Core principles and guidelines for designing effective in-app paywalls, upgrade screens, and freemium conversion flows.
---

# 💳 Paywall & Upgrade CRO Rules

Guidelines for creating in-app paywalls and upgrade flows that convert free users to paid at moments when they've experienced enough value to justify the commitment.

## 1. Core Principles

- **Value Before Ask**: User should have experienced real value first. The upgrade should feel like a natural next step. Timing: After "aha moment," not before.
- **Show, Don't Just Tell**: Demonstrate the value of paid features. Preview what they're missing. Make the upgrade feel tangible.
- **Friction-Free Path**: Easy to upgrade when ready. Don't make them hunt for pricing. Remove barriers to conversion.
- **Respect the No**: Don't trap or pressure. Make it easy to continue free. Maintain trust for future conversion.

## 2. Paywall Trigger Points

### Feature Gates

When user clicks a paid-only feature:

- Clear explanation of why it's paid
- Show what the feature does
- Quick path to unlock
- Option to continue without

### Usage Limits

When user hits a limit:

- Clear indication of what limit was reached
- Show what upgrading provides
- Option to buy more without full upgrade
- Don't block abruptly

### Trial Expiration

When trial is ending:

- Early warnings (7 days, 3 days, 1 day)
- Clear "what happens" on expiration
- Easy re-activation if expired
- Summarize value received

### Time-Based Prompts

After X days/sessions of free use:

- Gentle upgrade reminder
- Highlight unused paid features
- Not intrusive—banner or subtle modal
- Easy to dismiss

### Context-Triggered

When behavior indicates upgrade fit:

- Power users who'd benefit
- Teams using solo features
- Heavy usage approaching limits
- Inviting teammates

## 3. Paywall Screen Components

### Headline

Focus on what they get, not what they pay:

- "Unlock [Feature] to [Benefit]"
- "Get more [value] with [Plan]"
- NOT: "Upgrade to Pro for $X/month"

### Value Demonstration

Show what they're missing:

- Preview of the feature in action
- Before/after comparison
- "With Pro, you could..." examples
- Specific to their use case if possible

### Feature Comparison

If showing tiers:

- Highlight key differences
- Current plan clearly marked
- Recommended plan emphasized
- Focus on outcomes, not feature lists

### Pricing

- Clear, simple pricing
- Annual vs. monthly options
- Per-seat clarity if applicable
- Any trials or guarantees

### Social Proof (Optional)

- Customer quotes about the upgrade
- "X teams use this feature"
- Success metrics from upgraded users

### CTA

- Specific: "Upgrade to Pro" not "Upgrade"
- Value-oriented: "Start Getting [Benefit]"
- If trial: "Start Free Trial"

### Escape Hatch

- Clear "Not now" or "Continue with Free"
- Don't make them feel bad
- "Maybe later" vs. "No, I'll stay limited"

## 4. Timing and Frequency

### When to Show

- **Best**: After value moment, before frustration
- After activation/aha moment
- When hitting genuine limits
- When using adjacent-to-paid features

### When NOT to Show

- During onboarding (too early)
- When they're in a flow
- Repeatedly after dismissal
- Before they understand the product

### Frequency Rules

- Limit to X per session
- Cool-down after dismiss (days, not hours)
- Escalate urgency appropriately (trial end)
- Track annoyance signals (rage clicks, churn)

## 5. Upgrade Flow Optimization

### From Paywall to Payment

- Minimize steps
- Keep them in-context if possible
- Pre-fill known information
- Show security signals

### Plan Selection

- Default to recommended plan
- Annual vs. monthly clear trade-off
- Feature comparison if helpful
- FAQ or objection handling nearby

### Checkout

- Minimal fields
- Multiple payment methods
- Trial terms clear
- Easy cancellation visible (builds trust)

### Post-Upgrade

- Immediate access to features
- Confirmation and receipt
- Guide to new features
- Celebrate the upgrade

## 6. Mobile Paywall Patterns

### iOS/Android Conventions

- System-like styling builds trust
- Standard paywall patterns users recognize
- Free trial emphasis common
- Subscription terminology they expect

### Mobile-Specific UX

- Full-screen often acceptable
- Swipe to dismiss
- Large tap targets
- Plan selection with clear visual state

### App Store Considerations

- Clear pricing display
- Subscription terms visible
- Restore purchases option
- Meet review guidelines

## 7. Anti-Patterns to Avoid

### Dark Patterns

- Hiding the close button
- Confusing plan selection
- Buried downgrade option
- Misleading urgency
- Guilt-trip copy

### Conversion Killers

- Asking before value delivered
- Too frequent prompts
- Blocking critical flows
- Unclear pricing
- Complicated upgrade process

### Trust Destroyers

- Surprise charges
- Hard-to-cancel subscriptions
- Bait and switch
- Data hostage tactics

## 8. A/B Testing Paywalls

### What to Test

- Trigger timing (earlier vs. later)
- Trigger type (feature gate vs. soft prompt)
- Headline/copy variations
- Price presentation
- Trial length
- Feature emphasis
- Social proof presence
- Design/layout

### Metrics to Track

- Paywall impression rate
- Click-through to upgrade
- Upgrade completion rate
- Revenue per user
- Churn rate post-upgrade
- Time to upgrade

## 🔗 Collaboration Permissions

### Allowed Personas

| Persona          | Use Case                                 |
| ---------------- | ---------------------------------------- |
| `page-cro`       | For public pricing page optimization     |
| `onboarding-cro` | For driving to aha moment before upgrade |
| `copywriting`    | For persuasive copy and messaging        |
| `form-cro`       | For checkout form optimization           |

### Collaboration Protocol

1. **Identify need**: Determine if the task benefits from another persona's expertise
2. **Consult**: Use `/ask-persona [name] "[query]"` to get specialized input
3. **Wait**: Process the response before proceeding
4. **Integrate**: Apply insights into your work
