## 🎯 FASE 5: Analytics & Polimento

### PRP-005: Dashboard & Analytics

**Objetivo:** Transformar dados em decisões. Painel gerencial para Super Admin e Admin de Imobiliária, além do polimento final de UX.

---

### 🧠 Validação (Ricardo's Methodology)

**1. A Gambiarra (Workaround):**
*O gerente soma as vendas no Excel no dia 30 para calcular comissões e saber "como foi o mês".*

**2. O Ódio Tolerado (Pain Point):**
*Não saber qual portal (Zap, VivaReal, Facebook) traz leads melhores, gastando verba de marketing às cegas.*

**3. A Customização (Feature Gap):**
*Quadros brancos na parede do escritório com "risquinhos" de vendas por corretor.*

---

### ✍️ Copy Insights (Handover para Pamela)

- **Headline Pain:** "Pare de dirigir sua imobiliária olhando pelo retrovisor."
- **Value Prop:** "Metas, conversão e comissões em tempo real. Decida hoje, lucre amanhã."
- **Feature Hero:** "Raio-X da Venda: Do clique ao contrato, saiba exatamente o que funciona."

---

#### ✅ Checklist de Completude (Validar antes de executar)

**1. Contexto e Escopo**
- [ ] Objetivo: Dashboards visuais e relatórios.
- [ ] Dependências: Dados de `leads` (status='fechado') e `properties`.
- [ ] Escopo: Dashboard Home, Relatórios Exportáveis.

**2. Especificações de Layout**
- [ ] **Bento Grids:** Layout modular com cards de métricas.
- [ ] **Charts:** Gráficos de linha (Evolução de Leads) e Pizza (Origem de Leads) usando `recharts`.
- [ ] **Leaderboard:** Ranking de corretores (Gamificação).

**3. Detalhamento de Componentes**
- [ ] **Date Range Picker:** "Últimos 7 dias", "Este Mês", "Customizado".
- [ ] **Metric Card:** Com indicador de tendência (⬆️ 12% vs mês anterior).

**4. Integração com Backend**
- [ ] **SQL Views:** Criar Views agregadas no Supabase para performance (não calcular no frontend).
- [ ] **RPC Functions:** `get_dashboard_stats(org_id, start_date, end_date)`.

**5. Polimento (The Vibe)**
- [ ] **Confetti:** Animação ao marcar venda como "Fechada".
- [ ] **Skeletons:** Loading states elegantes em todos os cards.
- [ ] **Toast:** Feedback visual consistente para todas as ações.

---

#### 📋 Especificação Técnica

**Arquitetura:**
- `src/app/dashboard/page.tsx`: Dashboard principal (agora com dados reais).
- `src/components/dashboard/overview.tsx`: Gráficos.
- `src/components/dashboard/recent-sales.tsx`: Lista últimas vendas.

**Bibliotecas:**
- `recharts`: Leve, composable e styleable com Tailwind.

---

#### 🔗 Relacionamentos

**Depende de:**
- Todas as fases anteriores (precisa de dados para mostrar).

**Bloqueia:**
- Lançamento Oficial v1.0

---

*Criado em: 2026-01-08*
*Autor: 01 - Ricardo (Refatorado)*
