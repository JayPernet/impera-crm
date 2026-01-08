## 🎯 FASE 3: Gestão de Leads (Pipeline)

### PRP-003: Leads Management & Kanban

**Objetivo:** Implementar o Funil de Vendas (Pipeline) e a gestão de contatos, permitindo que corretores visualizem e movam leads entre estágios.

---

#### ✅ Checklist de Completude (Validar antes de executar)

**1. Contexto e Escopo**
- [x] Objetivo: Visualizar e manipular o fluxo de vendas.
- [x] Dependências: `leads` table (já criada), Auth (já funcional).
- [ ] Escopo: Kanban Board, Lista de Clientes, Criação Manual de Lead.

**2. Especificações de Layout**
- [ ] **Kanban Board:** Colunas representando `status` ou `pipeline_step`.
    - Estágios: `Novo`, `Em Contato`, `Visita Agendada`, `Visita Realizada`, `Em Negociação`, `Fechado`, `Perdido`.
- [ ] **Drag & Drop:** Usar `@hello-pangea/dnd` ou `dnd-kit` para mover cards.
- [ ] **Lead Card:** Nome (Negrito), Telefone, Última Interação (Relativa), Badge de Origem.
- [ ] **Client List:** Tabela simples para busca rápida (Data Grid reutilizado).

**3. Detalhamento de Componentes**
- [ ] **Avatar Placeholder:** Círculo com iniciais coloridas (ex: "JP" em fundo Índigo) para substituir fotos.
- [ ] **Quick Actions:** Botão de WhatsApp direto no card.

**4. Integração com Backend**
- [ ] **Tabela `leads`:**
    - Campos Chave: `pipeline_step` (int), `status` (text), `source` (text).
- [ ] **Server Actions:** `moveLead(id, newStep)`, `createLead(data)`.
- [ ] **Real-time:** (Opcional por enquanto) Atualizar Kanban se outro user mexer.

**5. Automação (Hook)**
- [ ] Disparar Webhook para N8N apenas na criação (`INSERT`). A movimentação de card é interna por enquanto.

---

#### 📋 Especificação Técnica

**Arquitetura de Pastas:**
- `src/app/dashboard/leads/page.tsx`: Redireciona para Pipeline ou mostra Toggle View.
- `src/app/dashboard/leads/kanban/page.tsx`: Visualização em Colunas.
- `src/app/dashboard/leads/list/page.tsx`: Visualização em Tabela.
- `src/components/leads/kanban-board.tsx`: Client Component com lógica de DnD.
- `src/components/leads/lead-card.tsx`: Card individual.

**Bibliotecas:**
- `dnd-kit` (Recomendado pela acessibilidade e modernidade) ou `@hello-pangea/dnd`.

---

#### 🔗 Relacionamentos

**Depende de:**
- Componentes Base (Badge, Button) criados na Missão 02.

**Bloqueia:**
- PRP-004: Chat (precisa clicar no lead para abrir conversa).

---

*Criado em: 2026-01-06*
*Autor: 07 - Helena*
