# Design System Setup Workflow (From Prompt 1)

This workflow defines how to analyze a design screenshot and extract design tokens to set up a complete design system.

## Core Workflow

### 1. Analyze the Design Visually
When given a design screenshot or inspiration, identify:

**Colors:**
- Primary/brand color → generate full scale (50-900)
- Neutral/grey colors → generate full scale (50-900)
- Semantic colors (success, error, warning, info)
- Background and surface colors
- Border colors

**Typography:**
- Font family (sans-serif, serif, monospace)
- Heading sizes and weights
- Body text sizes
- Line heights and letter spacing

**Spacing & Radius:**
- Spacing rhythm (tight, normal, relaxed)
- Border radius style (sharp, rounded, pill)
- Use 8px grid system

**Shadows:**
- Shadow style (none, subtle, prominent)
- Define elevation levels

### 2. Generate Design Tokens
Create or update the `design_system.json` with extracted tokens:
- All colors as CSS variables
- Typography scale using `clamp()` for fluid responsiveness
- Spacing system based on 8px grid
- Border radius values
- Shadow definitions

### 3. Component Specifications
For each component type, define:
- **Buttons:** Primary, secondary, ghost variants with hover/active states
- **Cards:** Default, elevated, subtle variants with shadows
- **Icons:** Size scale and container styles
- **Badges:** Padding, border-radius, text transform
- **Inputs:** Border, focus states, padding

### 4. Animation Philosophy
Specify:
- Entrance animations (fadeInUp, slideIn)
- Hover effects (lift, scale, shadow increase)
- Transition timings (0.2s-0.4s)
- Easing curves (ease-out for entrances, ease-in for exits)

## Key Principles
- **CSS Variables First:** All colors, spacing, and typography must use CSS variables
- **Responsive by Default:** Use `clamp()` for fluid typography and spacing
- **Accessibility:** Ensure 4.5:1 contrast ratio minimum (WCAG AA)
- **Premium Feel:** Avoid generic colors and standard gradients
