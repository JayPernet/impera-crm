# PRP-001: Fundação & Auth Multi-Tenant

**Contexto:** Início do projeto CRM Imobiliário.
**Role:** Marcos (Backend) & Claudio (Full-Stack).

## 1. 🎯 Objetivo
Inicializar o repositório (`star-crm-imob`), configurar a stack mandatória (Next.js 16 + Drizzle + Supabase) e implementar o sistema de Autenticação Multi-Tenant com RLS rigoroso.

## 2. 🛠️ Tech Stack (Mandatória)
- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (Postgres)
- **ORM:** Drizzle (Drivers postgres-js)
- **Auth:** Supabase Auth (Native)
- **Styling:** Tailwind v4 (Setup inicial)

## 3. 📋 Passo a Passo de Execução

### Fase 1: Setup
1.  Inicializar projeto Next.js + Typescript + ESLint.
2.  Configurar Drizzle (`drizzle.config.ts`) e conexão Supabase.
3.  Configurar Shadcn UI (apenas `button`, `input`, `form` por enquanto).

### Fase 2: Schema & Migrations (`organizations` & `profiles`)
1.  Criar tabelas no Drizzle schema (conforme `CRM_Database_Inventory.md`):
    - `organizations`: id, name, plan.
    - `profiles`: id (FK auth), org_id (FK orgs), role.
2.  Gerar e aplicar migration inicial.

### Fase 3: RLS & Auth Flow
1.  Criar Middleware do Next.js para proteger rotas `/dashboard`.
2.  Criar Trigger no Postgres: Ao criar usuário no Auth ➔ Criar `profile` (e `organization` se for signup de admin).
3.  **Implementar RLS:**
    - `profiles`: Usuário só vê seu próprio perfil.
    - `organizations`: Usuário só vê organização linkada ao seu perfil.

### Fase 4: Tela de Onboarding (Básico)
1.  Tela de Login/Signup (Shadcn simples).
2.  Tela de "Criar Imobiliária" (se usuário novo).
3.  Redirecionamento para `/dashboard/[org_id]`.

## 4. ✅ Checklist de Validação (DoD)
- [ ] Consigo criar uma conta e uma organização nova.
- [ ] No Supabase Dashboard, vejo o user em `auth.users` e em `public.profiles`.
- [ ] Se eu tentar acessar `/dashboard/outra-org-id` manualmente, tomo 403 ou 404 (RLS funcionando?).
- [ ] O projeto roda sem erros de lint (`npm run lint`).

---
**Instrução para a IA:** Execute em passos pequenos. Primeiro o setup, depois o banco, depois a tela. Não tente fazer tudo num único prompt de código.
