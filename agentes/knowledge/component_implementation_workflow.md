# Component Development Workflow (From Prompt 2)

This workflow defines how to implement components with surgical precision.

## Core Implementation Principles

### 1. Isolation First
Before implementing any component:
- Can this be built independently?
- What are the dependencies?
- What props interface is needed?

### 2. TypeScript Interface
Always define props with TypeScript:
```tsx
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  onAction?: () => void
}
```

### 3. Edge Cases
Handle all states:
- **Loading:** Show skeleton or spinner
- **Empty:** Display empty state message
- **Error:** Show error boundary or fallback
- **Disabled:** Visual feedback and prevent interaction

### 4. Component Patterns

**Button Component:**
```tsx
export function Button({
  variant = 'default',
  size = 'md',
  isLoading,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "transition-all duration-200",
        variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
        size === 'md' && "px-4 py-2",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}
```

**Card Component:**
```tsx
export function Card({
  variant = 'default',
  children,
  className
}: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-6",
      variant === 'default' && "bg-card text-card-foreground border-border",
      variant === 'elevated' && "bg-card shadow-lg",
      className
    )}>
      {children}
    </div>
  )
}
```

### 5. Reusability
Extract common patterns:
```tsx
// utils/cn.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 6. Performance
Optimize by default:
- Use `React.memo()` for expensive components
- Lazy load heavy components
- Memoize callbacks with `useCallback`
- Memoize values with `useMemo`

## Implementation Checklist
Before marking a component as complete:
- [ ] TypeScript interface defined
- [ ] All variants implemented
- [ ] Edge cases handled (loading, empty, error)
- [ ] Hover/focus states work
- [ ] Responsive behavior correct
- [ ] No hardcoded values (use design tokens)
- [ ] Extracted reusable utilities
- [ ] Performance optimized (memo, lazy load)

## Key Principles
- **Atomic:** Build one component at a time
- **Type-Safe:** TypeScript for everything
- **Clean:** Follow SOLID principles
- **DRY:** Don't repeat yourself
- **Performant:** Optimize by default
