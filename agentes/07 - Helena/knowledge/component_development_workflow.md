# Component Development Workflow (From Prompt 2)

This workflow defines how to add components to a project, focusing on surgical component creation.

## Core Workflow

### 1. Component Specification
When tasked with creating a component, first define:

**Component Purpose:**
- What problem does this component solve?
- Where will it be used in the application?
- What are the key interactions?

**Component Variants:**
- Size variants (small, default, large)
- Style variants (default, primary, secondary, ghost, outline)
- State variants (default, hover, focus, disabled, loading, error)

**Component Props:**
- Required props
- Optional props with defaults
- TypeScript interface

### 2. Build or Customize
**If using existing components:**
- Import from `/components/ui/`
- Customize by creating a wrapper in `/components/[ComponentName].tsx`
- Extend with new variants using CSS variables

**If building custom:**
- Use existing components as building blocks
- Follow CSS variable patterns from design system
- Ensure consistency with existing components

### 3. Component Structure
```tsx
import { cn } from "@/lib/utils"

interface ComponentProps {
  variant?: 'default' | 'primary' | 'muted'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export function Component({
  variant = 'default',
  size = 'md',
  children,
  className
}: ComponentProps) {
  return (
    <div className={cn(
      "base-styles",
      variant === 'default' && 'bg-card text-card-foreground',
      variant === 'primary' && 'bg-primary text-primary-foreground',
      size === 'sm' && 'p-2 text-sm',
      size === 'md' && 'p-4',
      className
    )}>
      {children}
    </div>
  )
}
```

### 4. Styling Guidelines
- **Use CSS Variables:** `bg-primary`, `text-foreground`, `border-border`
- **Tailwind Classes:** Reference design tokens via Tailwind
- **Responsive:** Use responsive prefixes (`md:`, `lg:`)
- **Hover States:** Always define hover behavior
- **Transitions:** Specify duration and easing

### 5. Component Showcase (Optional)
For design system documentation:
- Create `/app/styleguide/components/[component-name]/page.tsx`
- Show all variants side by side
- Include code examples
- Document props and usage

### 6. Testing Checklist
Before considering a component complete:
- [ ] All variants render correctly
- [ ] Hover/focus states work
- [ ] Responsive behavior is correct
- [ ] TypeScript types are defined
- [ ] Edge cases handled (empty, loading, error)
- [ ] Accessibility (keyboard navigation, ARIA)

## Key Principles
- **Atomic Components:** Build in isolation before integrating
- **Type Safety:** Use TypeScript interfaces for all props
- **Reusability:** Extract common patterns into utilities
- **CSS Variables:** All colors and spacing from design system
- **No Hardcoded Values:** Use constants or config files
