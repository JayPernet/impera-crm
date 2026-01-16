# PRP Best Practices (StarIAup Standard)

## 1. WHAT vs HOW
- **Bad:** "Import createClient from supabase-js and use it in a useEffect." (Too specific, limits AI creativity/efficiency).
- **Good:** "Implement data fetching using the Supabase client. Ensure loading states are handled and types are enforced." (Focuses on the outcome).

## 2. Visual Granularity
When specifying UI, Helena must translate Amanda's specs into Tailwind-ready instructions:
- Use specific spacing (e.g., `gap-4`, `p-8`).
- Use specific shadows (e.g., `shadow-[0px_4px_20px_rgba(0,0,0,0.1)]`).
- Specify transition timings (e.g., `duration-300 ease-in-out`).

## 3. The "Incremental Mission" Rule
Never ask for a whole feature at once if it's complex.
- **Mission 1:** Foundation (Schema + Types).
- **Mission 2:** Logic (Edge Functions/Queries).
- **Mission 3:** UI (Layout + Basic Components).
- **Mission 4:** UX (Animations + Refinements).

## 4. Tech Stack Assumption
Always assume and enforce:
- React + TypeScript + Vite.
- Tailwind CSS + Shadcn UI.
- Supabase for Backend.
- Lucide React for Icons.
