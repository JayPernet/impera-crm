# Legacy Map: Análise do Esquema Existente

**Responsável:** Sofia (CTO)
**Data:** 2026-01-16 (Data atual)

## Objetivo
Este documento mapeia o estado atual do esquema do banco de dados, com base nos arquivos `.sql` existentes no projeto. Esta análise serve como base para a criação do `inventario_database.md` e garante que a nova arquitetura respeite e se integre com a estrutura legada.

## Fontes Analisadas
- `crm-web/src/app/dashboard/chat/schema.sql`
- `update_leads_classification.sql`
- `update_leads_table.sql`
- `update_properties_table.sql`
- `gitIgnore/esteticaPro_crm_inspo/supabase/migrations/*` (Considerado como inspiração, não como fonte canônica)

## Descobertas Chave

### 1. Tipagem de Chaves Primárias
- **Observação:** O arquivo `crm-web/src/app/dashboard/chat/schema.sql` define a chave primária `leads(id)` como `uuid`.
- **Decisão:** Todas as chaves primárias de entidades principais (`agencies`, `users`, `leads`, `clients`, `properties`) serão padronizadas para `uuid` para manter a consistência com o esquema existente. `bigint` será usado para chaves primárias de tabelas auxiliares, se necessário.

### 2. Tabela de Mensagens
- **Observação:** Existe uma tabela `messages` em `crm-web/src/app/dashboard/chat/schema.sql`.
- **Decisão:** Esta tabela será adotada como a tabela `messages` no `inventario_database.md`, enriquecida com RLS e outras políticas. Não será criada uma nova tabela `whatsapp_messages`.

### 3. Modificações de Tabelas Existentes
- **Observação:** Os arquivos `update_leads_table.sql`, `update_properties_table.sql`, e `update_leads_classification.sql` indicam `ALTER TABLE` para adicionar novas colunas.
- **Decisão:** Estas colunas devem ser incorporadas diretamente nas definições das tabelas `leads` e `properties` no `inventario_database.md`.
    - `leads.classification`: `text` (lead, client, archived).
    - `leads.ltv`: `numeric`.
    - `properties.status`: `text`.
    - Outras colunas de endereço em `properties`.

## Ações de Correção (Plano)
1.  **Modificar `inventario_database.md`:**
    -  Alterar a coluna `id` e todas as chaves estrangeiras relacionadas de `bigint` para `uuid` nas tabelas `agencies`, `users`, `leads`, `clients`, `properties`.
    -  Adicionar a tabela `messages` com base no `schema.sql` existente.
    -  Verificar se todas as colunas dos arquivos `update_*.sql` estão presentes nas definições das tabelas.
2.  **Concluir `inventario_database.md`:** Adicionar as tabelas restantes (se houver) e as seções de Enums e Funções.
3.  **Gerar `tech_architecture.md`:** Com o inventário consolidado, gerar o documento de arquitetura técnica.
