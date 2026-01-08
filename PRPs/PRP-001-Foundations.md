## 🎯 FASE 1: Fundação & Auth

### PRP-001: Foundations (Login & Multi-tenancy)

**Objetivo:** Estabelecer a fundação do SaaS (Next.js + Supabase) e implementar a tela de login com design premium (Glassmorphism) e lógica multi-tenant isolada.

---

#### ✅ Checklist de Completude (Validar antes de executar)

**1. Contexto e Escopo**
- [x] Objetivo da feature está claro (Auth SaaS)
- [x] Fase do projeto está identificada (Missão 01)
- [x] Dependências: `database_inventory.md` (Tabelas auth)

**2. Especificações de Layout**
- [x] Estrutura: Split-screen (Desktop) ou Vertical Stack (Mobile).
- [x] Responsividade: Mobile-first. Breakpoint `md` (768px) ativa o split.
- [x] Visual: Glassmorphism em fundo Dark Mode (#0A0A0A).

**3. Detalhamento de Componentes**
- [x] **Input Fields:** `bg-neutral-900`, `border-neutral-800`, Focus `ring-primary-500`.
- [x] **Button Primary:** Gradiente Indigo, hover lift, loading state interno.
- [x] **Card Container:** `backdrop-blur-md`, `bg-black/40`, borda sutil.

**4. Interações e Comportamento**
- [x] `onSubmit`: Server Action `loginAction(formData)`.
- [x] Validação: Zod no client e server (Email válido, Senha min 6).
- [x] Feedback: Toast "Credenciais inválidas" em caso de erro.
- [x] Redirecionamento: `/dashboard` após sucesso.

**5. Integração com Backend**
- [x] Supabase Auth (`auth.signInWithPassword`).
- [x] RLS: Garantir que o usuário só acesse sua `organization_id`.
- [x] Middleware: Proteger rotas `/dashboard/*`.

---

#### 📋 Especificação Técnica

**Layout Structure:**
- **Page Wrapper:** `min-h-screen w-full bg-[#0A0A0A] text-white flex`.
- **Left Panel (Hero):** 
    - `hidden md:flex w-1/2 bg-gradient-to-br from-neutral-900 to-black items-center justify-center p-12`.
    - Elemento Decorativo: "Abstract Indigo Glass Cube" (CSS/SVG).
- **Right Panel (Form):**
    - `w-full md:w-1/2 flex items-center justify-center p-8`.
    - **Login Card:** `w-full max-w-sm space-y-8`.

**Componentes (Shadcn + Tailwind v4):**
- `Label`: `text-xs font-medium text-neutral-400 uppercase tracking-wider`.
- `Input`: `h-12 rounded-lg bg-neutral-900/50 border border-neutral-800 text-neutral-200 placeholder:text-neutral-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200`.
- `Button`: `h-12 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-900/20 active:scale-95 transition-all`.

**States:**
- **Loading:** Botão mostra `<Loader2 className="animate-spin" />` e fica `disabled`.
- **Error:** Card shake animation (`animate-shake`), Input border torna-se `border-red-500/50`.

**Validações (Zod):**
```typescript
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta"),
})
```

---

#### 🔗 Relacionamentos

**Depende de:**
- Setup Next.js 16 (App Router)
- Supabase Project Credentials

**Bloqueia:**
- PRP-002: Dashboard Sidebar (precisa de sessão)
- PRP-003: CRUD Leads (precisa de RLS)

---

*Criado em: 2026-01-06*
*Autor: 07 - Helena (Baseado nas Specs da Amanda)*
