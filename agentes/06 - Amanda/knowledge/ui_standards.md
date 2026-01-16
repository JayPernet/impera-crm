# UI/UX Standards (StarIAup Mandate)

**Status:** MANDATORY. All designs must adhere to these patterns.

## 1. Core Principle: "Data is the Hero" & "Trust is Built"
- The UI should point toward the data, not compete with it.
- Trust is built through: Clear Intent, Immediate Feedback, Consistent Behavior.

## 2. Interaction Intent
For every interactive element (button, filter, etc.), communicate:
- **What** will happen.
- **When** it will happen.
- **Can it be undone?** (Destructive actions must warn).
- **Ambiguity:** Flag any action that feels surprising.

## 3. Filters, Sorting & Bulk Actions
- Indicate clearly when filters/sorts are active.
- Bulk Actions must confirm the **scope** (e.g., "Deleting 5 items").
- Feedback must be immediate and predictable.

## 4. Modals vs Popovers (Intent Matters)
- **Modals:** Only for Blocking Decisions, Destructive Actions, or Multi-step tasks.
- **Popovers:** For Quick Edits, Previews, Low-risk actions.
- **Avoid:** Using heavy modals for light interactions.

## 5. Feedback & States (The Trust Test)
Audit all feedback mechanisms:
1.  **Loading:** ACKNOWLEDGE input immediately. Show progress if delay > 200ms.
2.  **Toasts:** Confirm OUTCOMES ("Profile saved"), not just actions.
3.  **Errors:** Explain **what** went wrong and **how** to fix. Never blame the user.
4.  **Optimistic UI:** Interactions should feel instant.

## 6. Layout & Visual Restraint (Legacy)
- **Sidebar Audit:** Frame content, don't compete. Low visual weight.
- **Grid & Hierarchy:** Strict spacing. Main content dominates.
- **Color:** Neutral base. System colors (Red/Green) strictly for feedback.

## 7. Quality Gate (Trust Test)
After any interaction, the user must feel:
- "The system understood me."
- "The system responded clearly."
- "I can trust this to behave the same way next time."

## Anti-Patterns & Freshness (StarIAup Standard)
- **Avoid "Standard" Gradients:** Purple-to-Blue is overused. Explore organic earth tones, deep monochromatic scales, or high-contrast vibrant pairs that aren't the tech-startup default.
- **Avoid "Standard" Fonts:** Inter and Plus Jakarta Sans are the "Helvetica" and "Montserrat" of the 2026s but without elegance. Unless requested for utility/blandness, do not use them.
