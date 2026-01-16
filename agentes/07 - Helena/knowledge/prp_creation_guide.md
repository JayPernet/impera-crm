# PRP Creation Guide (From prompt-prp.md)

## Core Philosophy
PRPs (Product Requirement Prompts) translate PRDs into actionable instructions for AI agents. Unlike code, PRPs describe **WHAT to do**, not **HOW to implement**.

## Your Role as PRP Expert
- Create clear, detailed, unambiguous instructions
- Specify visual behaviors (animations, states, colors, spacing)
- Define objective validation criteria (screenshots, videos, tests)
- Organize into incremental missions with clear dependencies
- Focus on UI/UX when functional MVP already exists

## PRP Structure
For each feature/route, specify:

1. **Objective:** What must be achieved
2. **Context:** Required data, business rules
3. **Layout:** Complete visual structure
4. **States:** Normal, hover, focus, loading, error, success
5. **Interactions:** Animations, transitions, feedback
6. **Validations:** Objective success criteria
7. **Dependencies:** Libraries, components, data

## Core Principles
- **NEVER** generate code inside the PRP
- Describe **ALL** visual details (Tailwind colors, spacing, animations)
- Specify behavior at **ALL** breakpoints
- Define testable validations (not subjective)
- Use imperative language ("Create", "Add", "Validate")

## Response Formats

### Format 1: Comprehensive & Dense
Organize in incremental phases:
- **Phase 1:** Foundation (blockers)
- **Phase 2:** Core value (MVP)
- **Phase 3:** Secondary features
- **Phase 4:** Polish

### Format 2: Dense & Focused
Organize by individual PRP:
- **Phase 1:** Define what needs a PRP (user usually informs)
- **Phase 2:** Research internet for best references
- **Phase 3:** Follow PRP creation structure
- **Phase 4:** Deliver the PRP

For each PRP:
- Clear title (e.g., "PRP-003: Client Dashboard")
- Objective in 1 sentence
- Detailed specifications
- Validation checklist

## Assumed Technologies
- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI
- Supabase (Auth + Database)
- Lucide Icons

## Focus Variations

### MVP from Scratch:
Focus on functional minimum. Prioritize functionality over aesthetics.

### UI/UX Refinement:
Assume business logic exists. Detail animations, micro-interactions, visual states, and responsiveness.

### Granular (Component-by-Component):
Maximum granularity. Break each feature into individual reusable components with complete specs.

## 8-Category Validation Checklist

Before executing any PRP, validate:

### 1. Context and Scope
- [ ] Feature objective is clear
- [ ] Project phase is identified
- [ ] Dependencies on other features are mapped

### 2. Layout Specifications
- [ ] Component structure defined (containers, grids, sections)
- [ ] Responsiveness specified (mobile/tablet/desktop breakpoints)
- [ ] Visual states documented (loading, error, empty, success)

### 3. Component Details
- [ ] Each element has specific Tailwind classes
- [ ] Hover/focus/active states defined
- [ ] Transitions and animations specified (duration, easing, keyframes)
- [ ] Icons and assets referenced (library, size, color)

### 4. Interactions and Behavior
- [ ] User events mapped (onClick, onChange, onSubmit)
- [ ] Form validations specified (regex, error messages)
- [ ] Visual action feedback (loading spinners, toasts, modals)
- [ ] Error and success flows documented

### 5. Backend Integration
- [ ] API endpoints specified (method, route, payload)
- [ ] Database tables referenced (per Inventory)
- [ ] RLS policies considered (who can access what)
- [ ] API error handling defined

### 6. Micro-interactions
- [ ] Element entrance/exit animations
- [ ] Cursor states (pointer, not-allowed, etc.)
- [ ] Tactile feedback (scale, shadow, color changes)
- [ ] Screen/modal transitions

### 7. Accessibility
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Labels and aria-labels defined
- [ ] Color contrast validated
- [ ] Focus visible for all interactive elements

### 8. Files and Structure
- [ ] List of files to create/modify
- [ ] Dependency imports specified
- [ ] Folder structure defined

## Integration with Inventory
Every PRP must reference the `inventario_database.md`:
- Which tables are used
- What columns are read/written
- What RLS policies apply
- What API endpoints interact with the data

## Maintaining Context Between Sessions
When continuing work, provide:
- Previous project context
- Stack and design system details
- Route structure
- User roles and permissions
- Current MVP status
