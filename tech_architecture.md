# Tech Architecture - CRM Imobiliário v2.0

**Gerado por:** 02 - Sofia (CTO)
**Baseado em:** `project_brief.md` v2.0 e Mandato do PO (`assumption_log.md`).

## 1. Stack Tecnológica Definida

Seguiremos o **StarIAup Mandatory Stack**:
- **Frontend:** Next.js 16 (App Router) + React 19.
- **Backend/ORM:** Drizzle ORM (Postgres.js driver).
- **Database:** Supabase (PostgreSQL + RLS).
- **State/Data Layer:** TanStack Query v5 + Next.js `use cache`.
- **UI:** Shadcn UI + Tailwind v4.0.
- **Orquestração de IA:** **N8N** (Externo).

## 2. Estratégia de Multi-Tenancy (Isolamento)

Utilizaremos **Row Level Security (RLS)** nativo do Supabase como primeira e principal linha de defesa.

- **Tenant ID:** Todas as tabelas críticas (Imóveis, Leads, Clientes) possuem uma coluna `organization_id`.
- **JWT Context:** O Supabase injetará o `organization_id` no JWT do usuário. As políticas de RLS impedirão QUALQUER acesso a dados fora da organização do usuário.
- **Roles:**
    - `super_admin`: Bypass RLS (para gestão global e criação de imobiliárias).
    - `admin`: Gerente da Imobiliária. CRUD total na organização, inclusive gestão de corretores.
    - `corretor`: CRUD total de dados operacionais (Imóveis, Leads, Clientes) da sua organização, mas SEM permissão para gerenciar Admins.

## 3. Arquitetura de "Lançamentos" (Hierarquia)

Para suportar Empreendimentos e Unidades:
- **Tabela `properties`:** Terá uma coluna self-referencing `parent_id` (ou `condominio_id`).
- **Lógica:** Se `condominio_id` for null, é um imóvel avulso ou o cabeçalho de um Lançamento. Se preenchido, é uma unidade vinculada.

## 4. Integração N8N & Persistência Local (The Hub)

O CRM funcionará como um **Data Hub** sincronizado com as automações existentes do PO:
- **Tabelas Compartilhadas:** Herdaremos o schema de `n8n_historico_mensagens`, `n8n_fila_mensagens` e `fup_status` para manter compatibilidade com os fluxos atuais do PO.
- **Webhooks Bidirecionais:** 
    - **Inbound:** N8N insere no Supabase via nodes nativos.
    - **Outbound:** Webhooks disparados via Database Triggers do Supabase quando um Lead é criado ou alterado.
- **Vector Search:** Tabelas de embeddings nativas no Postgres para consultas de inventário pela IA do N8N.

## 5. Estratégia de WhatsApp & Chat UI

Implementaremos uma interface de chat real-time no CRM:
- **Fluxo de Envio:** `Dashboard UI` -> `Server Action` -> `n8n Webhook (Universal)` -> `WhatsApp API (Oficial/Não-Oficial)`. 
- **Configuração:** O Admin define no cadastro se usa API Oficial ou Não-Oficial (UI legal-safe), preenchendo Token/Instance ID conforme necessário.
- **Segurança:** A interface de chat respeitará o Tier da imobiliária (bloqueio se não contratado).
