# Tech Stack Mandate (Non-Negotiable)

This document defines the **Required Tech Stack** for all StarIAup projects.
**Status:** MANDATORY. Do not deviate unless explicitly authorized by the PO.

## Core Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
- **AI Orchestration:** Vercel AI SDK (Streaming, Tool calling, UI states).
- **Styling:** Tailwind CSS v4.0 (Oxide engine).
- **Component System:** shadcn/ui (Radix UI Primitives).
- **Validation:** Zod + React Hook Form.

## Data Integration Layer
- **Database/ORM:** Drizzle ORM (Serverless ready).
- **Data Source:** Supabase (Integrated via Drizzle).
- **Caching/State:** TanStack Query v5 (Client) + Next.js `use cache` (Server).
- **Data Grid:** TanStack Table v8.

## Architecture Patterns
- **Single Source of Truth:** UI reads from query cache, not local state.
- **Separation of Concerns:**
    - Server State: TanStack Query
    - UI State: Local React State
    - Form State: React Hook Form
- **Layouts:** Use `/app/(dashboard)/layout.tsx` for persistent sidebars.

## Security & Responsible Defaults
- **Security:** OWASP Top 10 (2025).
- **Rate Limiting:** Upstash/Redis for AI endpoints.
- **RBAC:** Enforce server-side permissions (not just UI hiding).
- **Audit:** Basic logging for Create/Update/Delete actions.
