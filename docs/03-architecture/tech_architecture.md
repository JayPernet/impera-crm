# Arquitetura Técnica - Impera CRM

**Versão:** 1.0.0
**Status:** Em Desenvolvimento
**Responsável:** Sofia (CTO & Chief Architect)
**Última Atualização:** 2026-01-16 (Data atual)

---

## 1. Visão Geral do Sistema

O Impera CRM é uma aplicação web multi-tenant projetada para pequenas e médias imobiliárias e corretores independentes. Seu objetivo principal é centralizar o gerenciamento de leads, clientes e imóveis, integrando-se nativamente com plataformas de comunicação como o WhatsApp e preparando-se para a integração com agentes de IA. A arquitetura é construída para ser robusta, segura, escalável e de fácil manutenção.

---

## 2. Tecnologias Centrais (Tech Stack Mandate)

Conforme `agentes/03 - Sofia/knowledge/tech_stack_mandate.md`, o projeto aderirá estritamente ao seguinte stack tecnológico:

*   **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
*   **AI Orchestration:** Vercel AI SDK (Streaming, Tool calling, UI states).
*   **Styling:** Tailwind CSS v4.0 (Oxide engine).
*   **Component System:** shadcn/ui (Radix UI Primitives).
*   **Validation:** Zod + React Hook Form.
*   **Database/ORM:** Drizzle ORM (Serverless ready).
*   **Data Source:** Supabase (PostgreSQL como backend).
*   **Caching/State:** TanStack Query v5 (Client) + Next.js `use cache` (Server).
*   **Data Grid:** TanStack Table v8.

---

## 3. Princípios Arquiteturais Aplicados

A arquitetura do Impera CRM será guiada pelos `agentes/03 - Sofia/knowledge/principios_arquitetura.md` para garantir um desenvolvimento eficiente e sustentável:

*   **D.R.Y (Don't Repeat Yourself):** Reuso de componentes, funções e lógicas de negócios para evitar redundância e facilitar a manutenção. O `design_system.json` será fundamental aqui.
*   **K.I.S.S (Keep It Simple, Stupid):** Priorização de soluções mais simples e diretas que atendam aos requisitos, evitando a complexidade desnecessária e o "over-engineering."
*   **Y.A.G.N.I (You Aren't Gonna Need It):** Implementação apenas das funcionalidades que são estritamente necessárias para a fase atual do roadmap, evitando "just-in-case" features que podem atrasar o desenvolvimento e introduzir complexidade precoce.
*   **Feature-Based Folder Structure (Etapa 4):** A organização do código será baseada em funcionalidades (`/auth`, `/leads`, `/clients`, etc.), ao invés de tipos de arquivos, promovendo a modularidade e facilitando a navegação e a colaboração.

---

## 4. Arquitetura da Camada de Dados

A camada de dados é a espinha dorsal do Impera CRM, com o `inventario_database.md` servindo como a "Single Source of Truth".

*   **Banco de Dados:** Supabase (PostgreSQL) será o provedor principal, aproveitando suas capacidades de autenticação (auth.uid()), Row-Level Security (RLS) e funções de banco de dados.
*   **ORM:** Drizzle ORM será utilizado para interagir com o banco de dados, oferecendo tipagem forte e suporte a ambientes serverless.
*   **Multi-tenancy:** A segregação de dados entre agências será implementada e estritamente forçada através de:
    *   `agency_id`: Uma coluna `uuid` presente em todas as tabelas de dados de negócio (`users`, `leads`, `clients`, `properties`, `messages`, `lead_property_interest`).
    *   **Row-Level Security (RLS):** RLS será habilitado e configurado para cada tabela, garantindo que usuários de uma agência só possam acessar os dados de sua própria agência. Políticas detalhadas estão no `inventario_database.md`.
*   **Identificadores:** Todos os IDs de entidades principais serão do tipo `uuid` (UUID v4) para garantir unicidade global e compatibilidade com o ecossistema Supabase Auth.
*   **Transações:** Utilização de transações de banco de dados via Drizzle ORM para garantir a atomicidade de operações complexas (e.g., conversão de lead para cliente).

---

## 5. Considerações de Design da API

A aplicação utilizará a arquitetura padrão do Next.js App Router para APIs, com Server Actions para mutações e um foco na revalidação de dados.

*   **Server Actions:** Para operações de escrita (INSERT, UPDATE, DELETE), garantindo segurança e validação no lado do servidor.
*   **Next.js Cache & TanStack Query:** Para otimização de performance e gerenciamento do estado do cliente e servidor. A UI lerá do cache de query, não do estado local.
*   **Validação:** Zod será empregado para validação de esquemas de entrada de dados, tanto no cliente quanto no servidor.

---

## 6. Considerações de Segurança

A segurança é uma prioridade máxima, com foco em:

*   **OWASP Top 10 (2025):** Todas as implementações seguirão as melhores práticas de segurança para mitigar vulnerabilidades comuns.
*   **RLS (Row Level Security):** Conforme detalhado no `inventario_database.md`, é a principal camada de segurança para isolamento de dados multi-tenant.
*   **RBAC (Role-Based Access Control):** As permissões serão verificadas no lado do servidor, e não apenas ocultadas na UI, para garantir que apenas usuários autorizados possam realizar ações.
*   **Variáveis de Ambiente:** Nenhuma informação sensível (chaves de API, credenciais) será hardcoded. Todas as configurações sensíveis serão gerenciadas via variáveis de ambiente (`.env`).
*   **Auditoria:** Implementação de logging básico para operações críticas (CREATE/UPDATE/DELETE) para fins de auditoria.

---

## 7. Considerações de Escalabilidade

A escolha da tecnologia e os princípios arquiteturais visam garantir a escalabilidade do Impera CRM:

*   **Supabase (PostgreSQL):** PostgreSQL é um banco de dados robusto e escalável. As características do Supabase o tornam adequado para cargas de trabalho crescentes.
*   **Drizzle ORM:** Leve e performático, ideal para ambientes serverless e para escalar com a aplicação.
*   **Next.js:** A arquitetura do App Router com Server Components e Server Actions é otimizada para performance e escalabilidade, permitindo que a lógica intensiva seja executada no servidor.
*   **Índices:** A inclusão estratégica de índices (`btree` para FKs e colunas frequentemente consultadas) no `inventario_database.md` garante que as operações de leitura permaneçam eficientes.
*   **Tipagem de ID (UUID):** A escolha de `uuid` para IDs primários ajuda a distribuir a carga de inserção em bancos de dados distribuídos.
*   **Rate Limiting:** Previsão de Upstash/Redis para endpoints de IA (futuramente) para proteger contra abusos.

---
