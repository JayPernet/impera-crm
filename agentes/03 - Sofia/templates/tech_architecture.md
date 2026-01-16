# Arquitetura Técnica - [Nome do Projeto]

## 1. Visão Geral da Solução
*Resumo executivo da arquitetura técnica, principais decisões e trade-offs.*

---

## 2. Princípios de Arquitetura (Non-Negotiables)
1.  **Feature-Based First**: A organização de pastas DEVE ser por feature, não por tipo.
2.  **Separation of Concerns**: UI, Lógica (Hooks) e Dados (Services) devem estar desacoplados.
3.  **Single Source of Truth**: O estado deve ter um dono claro (Server State vs Client State).
4.  **Security by Design**: RLS e validação de schema (Zod) em todas as pontas.

---

## 3. Tech Stack & Ferramentas
*   **Core**: [Next.js, React, TypeScript]
*   **Styling**: [TailwindCSS, Shadcn/UI, Lucide Icons]
*   **State Management**: [Zustand (Global), React Context (Feature-scoped), React Query (Server State)]
*   **Backend/BaaS**: [Supabase (Auth, DB, Realtime, Storage, Edge Functions)]
*   **Validation**: [Zod (Schema Validation), React Hook Form]
*   **Testing**: [Vitest (Unit), Playwright (E2E)]

---

## 4. Estrutura de Pastas (Feature-Based Architecture)
**A HIERARQUIA DEVE SER RESPEITADA RIGOROSAMENTE.**
*Regra: Se um componente é usado em mais de uma feature, ele vai para `shared`. Se é exclusivo, fica na feature.*

```text
src/
├── app/                  # Next.js App Router (Roteamento apenas, pouca lógica)
│   ├── (public)/
│   ├── (protected)/
│   └── api/
├── features/             # Módulos Autônomos de Funcionalidade
│   ├── [feature-name]/
│   │   ├── components/   # UI burra/apresentacional
│   │   ├── hooks/        # Lógica de estado e efeitos (Smart components logic)
│   │   ├── services/     # Chamadas API/Supabase diretas
│   │   ├── types/        # Tipos TypeScript específicos da feature
│   │   ├── utils/        # Funções auxiliares puras
│   │   └── index.ts      # Public API da feature (O que exporta para fora)
├── shared/               # Recursos compartilhados globalmente
│   ├── components/       # UI Kit (Button, Input, Card - shadcn)
│   ├── hooks/            # Hooks genéricos (useToast, useMediaQuery)
│   ├── lib/              # Configurações de infra (supabase, utils)
│   └── types/            # Tipos globais (User, Database Definitions)
└── styles/               # CSS global
```

---

## 5. Gerenciamento de Estado (State Strategy)

### Server State (Dados do Backend)
*   **Ferramenta**: [TanStack Query / SWR / Server Components]
*   **Estratégia**: Optimistic Updates para interações rápidas. Caching agressivo para leitura.

### Client State Global (App-wide)
*   **Ferramenta**: [Zustand]
*   **Uso**: Sessão do usuário, preferências de tema, carrinho de compras (se persistente).

### Feature State (Local)
*   **Ferramenta**: [React.useState, React.useReducer]
*   **Uso**: Formulários, toggles de UI, filtros temporários.

---

## 6. Data Fetching & Mutations Pattern

### Padrão para Services
```typescript
// features/todos/services/todoService.ts
export const getTodos = async (userId: string) => {
  const { data, error } = await supabase...
  if (error) throw new Error(error.message);
  return data;
};
```

### Padrão para Hooks
```typescript
// features/todos/hooks/useTodos.ts
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: () => getTodos(user.id)
  });
};
```

---

## 7. Tratamento de Erros & UX
*   **Boundary**: Error Boundaries globais no `layout.tsx` e por rota `error.tsx`.
*   **Feedback**: Toast notifications para erros de API (não bloquear a tela se possível).
*   **Logging**: Erros críticos devem ser logados (console.error em dev, Sentry em prod).

---

## 8. Segurança & Validação
*   **Input Validation**: Todos os formulários devem usar `zod` resolver.
*   **API Validation**: Edge Functions devem validar inputs via `zod` antes de processar.
*   **Auth**: Middleware verificando sessão em rotas protegidas.

---

## 9. Plano de Testes
*   **Unit**: Testar utilitários de negócio complexos em `utils/`.
*   **Integration**: Testar fluxos de hooks críticos.
*   **E2E**: Smoke test nos fluxos principais (Login -> Ação Principal -> Logout).

---

## 10. Estratégia de Deploy
*   **Provider**: [Vercel]
*   **Env Vars**: Validação de variáveis de ambiente no build (`t3-env` style).
*   **Migrations**: Supabase migrations aplicadas via CI/CD ou manual (controlado).
