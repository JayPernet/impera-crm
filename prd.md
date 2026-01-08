# PRD - IMPERA CRM (Imobiliário)

**Status:** Draft / Em Desenvolvimento
**Versão:** 2.0
**Contexto:** Evolução do StarIAup para o ecossistema IMPERA.

## 1. Visão Geral
**Objetivo:** Criar uma plataforma SaaS White-label (ou marca própria) para gestão de imobiliárias, centralizando o atendimento via WhatsApp e a gestão de leads (funil de vendas) em uma hierarquia de múltiplos níveis.
**Problema:** Imobiliárias perdem leads por falta de organização no WhatsApp dos corretores e não possuem um inventário de imóveis integrado ao atendimento.
**Sucesso:**
- Imobiliárias conseguem gerenciar seus corretores, leads e **imóveis** em um só lugar.
- Centralização da comunicação via WhatsApp com **apoio de IA**.
- Modelo de receita recorrente (SaaS) ativo para o Super Admin.

## 2. Personas e Hierarquia
1.  **Super Admin (Dono do SaaS):**
    - Cria planos e gerencia assinaturas.
    - Cadastra as Imobiliárias (Admins).
    - Visão global de todas as contas.
2.  **Admin (Imobiliária):**
    - Cliente do SaaS.
    - Gerencia sua equipe de Corretores.
    - **Gerencia o Inventário de Imóveis da Agência.**
    - Distribui leads (Roleta ou manual).
    - Visualiza relatórios de performance da sua agência.
3.  **Corretor (Usuário Final):**
    - Recebe e cadastra leads.
    - Atende via WhatsApp integrado.
    - Consulta o inventário de imóveis para ofertas rápidas.
    - Movimenta cards no Kanban de vendas.

## 3. Requisitos Funcionais (High-Level)

### Gestão e Acesso (SaaS)
- [ ] Login multi-nível (Super Admin, Admin, Corretor). Não há "crie sua conta" na tela de login.
- [ ] Super Admin: CRUD de Imobiliárias e bloqueio de inadimplentes.
- [ ] Admin: CRUD de Corretores.

### Gestão de Imóveis (Novo)
- [ ] **CRUD de Imóveis:** Cadastro de fotos, descrição, valor (Venda/Aluguel), localização, características (quartos, vagas, etc).
- [ ] **Isolamento:** O imóvel pertence à Imobiliária (Admin) e é visível para seus Corretores. Imobiliária A não vê imóveis da B.
- [ ] **Status:** Disponível, Reservado, Vendido/Alugado.

### CRM & Pipeline
- [ ] Kanban de Vendas (Colunas: Novo, Contato, Visita, Proposta, Fechado, Perdeu).
- [ ] Card do Lead: Dados do cliente, histórico de conversas, agendamentos e **Imóveis de Interesse**.

### Integração WhatsApp & Secretária IA (Novo)
- [ ] API de conexão com WhatsApp.
- [ ] Chat centralizado dentro do CRM.
- [ ] **Secretária IA:**
    -   Conectada ao WhatsApp da imobiliária/corretor.
    -   **RAG (Retrieval-Augmented Generation):** A IA lê o banco de imóveis da imobiliária para responder perguntas ("Tem apê de 3 quartos no centro?").
    -   **Qualificação:** Coleta dados básicos (nome, interesse) antes de passar para o corretor.
    -   **Handoff:** Transfere para humano quando solicitado ou quando não souber responder.

## 4. Requisitos Não-Funcionais (NFRs)
- **Performance:** Buscas de imóveis devem ser instantâneas (< 100ms).
- **Segurança:** Isolamento estrito de dados entre tenants (Imobiliárias).
- **IA:** Respostas da IA devem ser baseadas APENAS nos imóveis cadastrados (evitar alucinações).

## 5. Roadmap & Épicos
- **Épico 01: MVP Core (Estrutura SaaS):** Autenticação, Hierarquia de Usuários e CRUD de Contas.
- **Épico 02: Gestão de Imóveis:** Cadastro e busca de propriedades per tenant.
- **Épico 03: O CRM (Kanban):** Gestão de Leads e Pipeline.
- **Épico 04: O Zap & IA (Integração):** Conexão WhatsApp + Bot RAG de Imóveis.
- **Épico 05: Monetização:** Gestão de Planos e Pagamentos.
