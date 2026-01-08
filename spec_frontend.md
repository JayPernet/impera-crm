# Especificação Frontend v2.0 - CRM Imobiliário

**Gerado por:** 03 - Amanda (UI/UX)
**Referência:** [Design System](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/CRM_Design_System.md)
**Foco:** Dashboard Interno (MVP)

---

## 1. Estrutura Global (Layout Master)

- **Sidebar (Navegação):** 
  - Alinhada à esquerda, largura fixa (72px em ícones, 240px expandida).
  - Itens: Painel (Dashboard), Imóveis, Leads, Chat, Configurações.
  - Baixo contraste (Cinza escuro sobre fundo preto).
- **Header:** 
  - Breadcrumbs dinâmicos.
  - Seletor Global de Organização (apenas Super Admin).
  - Perfil do Corretor (com foto opcional).

---

## 2. Módulo: Dashboard de Vendas (Visão Geral)
*Inspirado na Image 0 e Image 2.*

- **Cards de Métricas (Top):** 
  - Vendas do Mês, Visualizações de Imóveis, Novos Leads, Receita Estimada.
- **Gráfico de Funil:** 
  - Visualização de conversão (Lead -> Visita -> Proposta -> Fechamento).
- **Feed de Atividades Recentes:**
  - "Novo lead via Landing Page", "Imóvel X reservado".

---

## 3. Módulo: Inventário de Imóveis
*Inspirado na Image 3 e Mandatos do PO.*

- **Visualização em Tabela (Default):** 
  - Colunas densas: Foto (Miniatura), Título, Tipo (Apartamento/Casa), Preço, Bairro, Status, Tarja.
  - Ações rápidas no hover (Editar, Ver no Site, Gerar PDF).
- **Filtros Avançados:** 
  - Range de preço (Slider), Dormitórios, Suites, Tags de Características.
- **Hierarquia de Lançamentos:**
  - Agrupamento visual de unidades sob o mesmo Empreendimento (Parent/Child).

---

## 4. Módulo: Central de Chat (WhatsApp)
*Inspirado na Image 1 e Fluxo N8N.*

- **Layout Split-Screen:** 
  - Esquerda: Lista de conversas (Avatar substituído por iniciais coloridas).
  - Centro: Área de chat com bolhas suaves e backgrounds limpos.
  - Direita: **Context Sidebar** (Informações do Lead + Imóveis de interesse).
- **Componentes de Ação:**
  - Botão "Enviar Imóvel": Abre modal de busca rápida para enviar link via chat.
  - "Notas da IA": Resumo gerado pelo N8N sobre o perfil do cliente.
- **Sinalização de API:**
  - Badge discreto indicando se a conexão é "Oficial" ou "Não Oficial".

---

## 5. Estados de UI & Feedback

- **Loading:** Skeletons em todos os módulos de dados (Hero Data).
- **Empty States:** Ilustrações minimalistas em tons de cinza com CTAs claros ("Cadastrar Primeiro Imóvel").
- **Optimistic UI:** Ao mover um lead no Kanban ou alterar um status, a UI reflete instantaneamente antes da confirmação do banco.
- **Error States:** Toasts discretos (sonner/toast) com explicação amigável em PT-BR.

---

## 6. Governança de Avatar
- **Lead/Cliente:** 🎨 Círculo colorido com iniciais (Ex: "João Silva" -> JS).
- **Corretor:** 👤 Foto real ou avatar padrão StarIAup se não houver upload.

---

## 7. Login & Authentication (Experience)
**Reference:** `design_system.json` (Dark Mode, Trust, High Density)

### 7.1 Visual Structure (Split Screen)
- **Left/Top (Brand & Trust):**
  - **Background:** Deep Black `secondary.black` (#0A0A0A) or subtle gradient.
  - **Content:** Logo "StarIAup CRM" (White/Agate), tagline "Intelligence that Sells".
  - **Hero Image:** Abstract data visualization or high-end architectural photo (B&W/Desaturated).
- **Right/Center (Interaction):**
  - **Container:** Glassmorphism Card (`rgba(21, 21, 21, 0.4)`, blur 10px).
  - **Width:** Fixed 400px (Desktop), Full width (Mobile).
  - **Padding:** `p-8` (32px).

### 7.2 Input Fields (High Precision)
- **Style:** "Invisible" borders until interaction.
- **Normal:** Background `bg-neutral-900`, Border `border-neutral-800`.
- **Focus:** Border `border-primary-500` (Indigo), slight Glow `ring-2 ring-primary-500/20`.
- **Typography:** `Outfit`, 14px, `text-neutral-200`. Placeholder `text-neutral-600`.
- **Icons:** Lucide icons (Mail, Lock) inside the input (left), text-neutral-500.

### 7.3 Buttons & Actions
- **Primary (Entrar):**
  - Full width.
  - Gradient `bg-gradient-to-r from-primary-600 to-primary-500`.
  - Hover: `scale-[1.02]`, brightness-110.
  - **Micro-interaction:** On click, transform text to "Loading Spinner" (white).
- **Secondary (Esqueci a senha):**
  - Link text, `text-sm`, `text-neutral-500`, hover `text-primary-400`.
- **Footer:** "Powered by StarIAup" (small, muted).

### 7.4 States
- **Error:** Shake animation on the card. Input border turns Red-500. Toast message: "Credenciais inválidas".
- **Success:** Button turns Green-500 (Checkmark), fade out to Dashboard.
- **Session Expured:** Modal overlay on glass background forcing re-login.
