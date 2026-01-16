# Design Token Refactoring Task

## Objective
Replace all hardcoded color values (e.g., `white/[0.03]`, `white/[0.05]`) with proper design system tokens across legacy dashboard pages.

## Scope
The following files contain hardcoded colors that need to be refactored:

### Dashboard Pages
- `/src/app/dashboard/page.tsx` - Main dashboard
- `/src/app/dashboard/properties/page.tsx` - Properties list
- `/src/app/dashboard/leads/page.tsx` - Leads list
- `/src/app/dashboard/clients/page.tsx` - Clients list
- `/src/app/dashboard/clients/[id]/page.tsx` - Client details

### Admin Pages
- `/src/app/dashboard/admin/organizations/page.tsx`
- `/src/app/dashboard/admin/organizations/organization-table.tsx`
- `/src/app/dashboard/admin/organizations/create-organization-dialog.tsx`
- `/src/app/dashboard/admin/organizations/edit-organization-dialog.tsx`

## Mapping Guide

### Background Colors
| Hardcoded | Token | Usage |
|-----------|-------|-------|
| `bg-white/[0.02]` | `bg-surface` | Subtle background lift |
| `bg-white/[0.03]` | `bg-surface-elevated` | Cards, elevated surfaces |
| `bg-white/[0.05]` | `bg-surface-hover` | Hover states |

### Border Colors
| Hardcoded | Token | Usage |
|-----------|-------|-------|
| `border-white/[0.05]` | `border-border` | Standard borders |
| `border-white/5` | `border-border` | Standard borders (alternative syntax) |
| `border-white/10` | `border-border-strong` | Emphasized borders |

### Text Colors
All text should already be using tokens like:
- `text-text-primary`
- `text-text-secondary`
- `text-text-tertiary`
- `text-text-muted`

## Implementation Steps

1. **Batch Replace** - Use find/replace for common patterns:
   ```
   bg-white/[0.03] → bg-surface-elevated
   bg-white/[0.02] → bg-surface
   bg-white/[0.05] → bg-surface-hover
   border-white/[0.05] → border-border
   border-white/5 → border-border
   border-white/10 → border-border-strong
   ```

2. **Manual Review** - Check each file for context-specific replacements

3. **Test Build** - Run `npm run build` to ensure no TypeScript errors

4. **Visual QA** - Verify the UI looks identical after changes

## Priority
**Medium** - This is a code quality improvement that doesn't affect functionality but ensures consistency and maintainability.

## Estimated Effort
~30-45 minutes for all files

## Success Criteria
- ✅ Zero instances of `white/[0.` in dashboard files
- ✅ Build passes without errors
- ✅ Visual appearance unchanged
- ✅ All changes committed with clear message
