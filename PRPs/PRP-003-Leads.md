## 🎯 FASE 3: Gestão de Leads (Pipeline)

### PRP-003: Leads Management & Kanban

**Objetivo:** Implementar o Funil de Vendas (Pipeline) e a gestão de contatos, permitindo que corretores visualizem e movam leads entre estágios.

---

### 🧠 Validação (Ricardo's Methodology)

**1. A Gambiarra (Workaround):**
*Corretores usam o recurso "Etiquetas" do WhatsApp Business em seus celulares pessoais para tentar simular um funil (Ex: "A - Quente", "B - Visita").*

**2. O Ódio Tolerado (Pain Point):**
*O dono da imobiliária odeia perguntar "E aquele cliente da cobertura?" e ouvir "Ih, esqueci de responder, esfriou".*

**3. A Customização (Feature Gap):**
*Gerentes criam grupos de WhatsApp "Mural de Oportunidades" e ficam cobrando status manualmente de cada lead.*

---

### ✍️ Copy Insights (Handover para Pamela)

- **Headline Pain:** "Chega de perder vendas por esquecimento."
- **Value Prop:** "Visualize cada real na mesa. Arraste, solte e feche."
- **Feature Hero:** "Pipeline Visual: O mapa do seu dinheiro, do 'Oi' até o 'Assinado'."

---

#### ✅ Checklist de Completude (Validar antes de executar)

**1. Contexto e Escopo**
- [x] Objetivo: Visualizar e manipular o fluxo de vendas.
- [x] Dependências: `leads` table (já criada), Auth (já funcional).
- [x] Escopo: Kanban Board, Lista de Clientes, Criação Manual de Lead.

**2. Especificações de Layout**
- [x] **Kanban Board:** Colunas representando `status` ou `pipeline_step`.
    - Estágios: `Novo`, `Em Contato`, `Visita Agendada`, `Visita Realizada`, `Em Negociação`, `Fechado`, `Perdido`.
- [x] **Drag & Drop:** Usar `@dnd-kit/core` (já instalado) para mover cards.
- [x] **Lead Card:** Nome (Negrito), Telefone, Última Interação (Relativa), Badge de Origem.
- [x] **Client List:** Tabela simples para busca rápida (Data Grid reutilizado).

**3. Detalhamento de Componentes**
- [x] **Quick Actions:** Botão de WhatsApp direto no card.

**4. Integração com Backend**
- [x] **Tabela `leads`:**
    - Campos Chave: `pipeline_step` (int), `status` (text), `source` (text).
- [x] **Server Actions:** `moveLead(id, newStep)`, `createLead(data)`.
- [x] **Real-time:** (Opcional por enquanto) Atualizar Kanban se outro user mexer.

**5. Automação (Hook)**
- [x] Disparar Webhook para N8N apenas na criação (`INSERT`). A movimentação de card é interna por enquanto.

---

#### 📋 Especificação Técnica

**Arquitetura de Pastas:**
- `src/app/dashboard/leads/page.tsx`: Redireciona para Pipeline ou mostra Toggle View.
- `src/app/dashboard/leads/kanban/page.tsx`: Visualização em Colunas.
- `src/app/dashboard/leads/list/page.tsx`: Visualização em Tabela.
- `src/components/leads/kanban-board.tsx`: Client Component com lógica de DnD.
- `src/components/leads/lead-card.tsx`: Card individual.

**Bibliotecas:**
- `dnd-kit` (Já consta no package.json).

---

#### 🔗 Relacionamentos

**Depende de:**
- Componentes Base (Badge, Button) criados na Missão 02.

**Bloqueia:**
- PRP-004: Chat (precisa clicar no lead para abrir conversa).

---

*Atualizado em: 2026-01-08*
*Autor: 01 - Ricardo (Refatorado)*
