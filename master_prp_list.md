# Master PRP List v2.0 - CRM Imobiliário

**Gerado por:** 07 - Helena (Prompt Engineer)
**Contexto:** BMAD Collaborative Flow.

Este roadmap define a execução técnica do CRM, priorizando a fundação de dados e a interface administrativa.

---

## 🚀 Mission 01: A Fundação (Tenant & Auth) 🟢 CONCLUÍDO
**Objetivo:** Setup inicial, autenticação multi-tenant e estrutura de perfis.
- **Tasks:**
  - Setup Next.js 16 + Tailwind v4.
  - Implementar Auth via Supabase.
  - Criar tabelas `organizations` e `profiles` com RLS.
  - Layout Master com Sidebar (PT-BR).
- **Entrega:** `PRP-001-Foundations`

## 🚀 Mission 02: O Inventário Pro (Imóveis) 🟢 CONCLUÍDO
**Objetivo:** CRUD completo de propriedades com a lógica de Lançamentos.
- **Tasks:**
  - ✅ Implementar tabela `properties` (v2.1 full columns).
  - ✅ Lógica de Hierarquia e Visibilidade (Toggles).
  - ✅ Sistema de Tarjas (Marketing).
  - ✅ Upload de imagens para Supabase Storage.
- **Entrega:** `PRP-002-Inventory` (100% Core Funcional)

## 🚀 Mission 03: Gestão de Leads & Clientes
**Objetivo:** Funil de vendas e base de contatos sem avatares.
- **Tasks:**
  - Implementar tabela `leads` integrando lógica do `banco_clientes`.
  - Dashboard de visualização (Kanban).
  - Listagem de Clientes (Iniciais coloridas no lugar de avatars).
- **Entrega:** `PRP-003-Leads`

## 🚀 Mission 04: Central de Chat & n8n Hub
**Objetivo:** Mensageira integrada e integração com automações.
- **Tasks:**
  - Implementar tabelas do N8N (`fup_status`, `n8n_historico_mensagens`).
  - Interface de Chat real-time (Unified Inbox).
  - Webhook de saída para N8N (Universal Hook).
  - Configuração de API (Oficial vs Não-Oficial) no Admin.
- **Entrega:** `PRP-004-ChatHub`

## 🚀 Mission 05: Atividades & Analytics
**Objetivo:** Inteligência de dados e polimento final.
- **Tasks:**
  - Página de Dashboard com métricas e gráficos.
  - Feed de atividades recentes.
  - Polimento final de UI (Skeletons, Toasts, Optimistic UI).
- **Entrega:** `PRP-005-Final`

---

## 🛠️ Validation Protocol
Cada missão só será considerada concluída após:
1.  **Sofia Check:** Schema está 100% fiel ao `database_inventory.md`.
2.  **Amanda Check:** UI segue as cores e densidade do `CRM_Design_System.md`.
3.  **Paulo Check:** RLS está impedindo vazamento de dados entre imobiliárias.
