# Inventário de Banco de Dados - Impera CRM

**Versão:** 1.1.0
**Status:** Atualizado (Epic 06: WhatsApp Integration)
**Responsável:** Sofia (CTO)
**Última Atualização:** 2026-01-16

---

## Ambiente e Configuração

### Ambiente Atual
- **Tipo:** Desenvolvimento
- **Provider:** Supabase
- **Database URL:** (A ser definido)

### Mapeamento de Migração
| Ambiente | Database URL | Notas |
|----------|--------------|-------|
| Local | postgresql://localhost:5432/[db_name] | Desenvolvimento local |
| Teste | [URL do Supabase Teste] | Branch de teste para validação |
| Produção | [URL do Supabase Produção] | Ambiente oficial em produção |

**Instruções de Migração:**
1. Gerar migração SQL a partir do esquema local (via Drizzle Kit).
2. Aplicar migração no Supabase Teste via interface ou CLI.
3. Verificar integridade dos dados e políticas RLS.
4. Repetir para Produção após aprovação em Teste.

---

## Tabelas

### Tabela: `organizations`

**Descrição:** Armazena informações sobre as imobiliárias que utilizam o CRM. Esta é a entidade central para o multi-tenancy.
**Tipo:** Core

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único da organização |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| updated_at | timestamptz | NOT NULL | now() | Última atualização do registro |
| name | text | NOT NULL | - | Nome da imobiliária |
| slug | text | - | - | Slug único para identificação da URL |
| subscription_status | text | - | - | Status da assinatura (active, trial, cancelled) |
| plan_id | text | - | - | ID do plano de assinatura |
| whatsapp_automated | boolean | - | false | Se a automação de WhatsApp está ativa |
| whatsapp_type | text | - | - | Tipo de integração WhatsApp (official, unofficial) |
| token_id | text | - | - | Token para integrações externas |
| instance_id | text | - | - | ID da instância do WhatsApp |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_organizations_name | name | btree | Otimizar buscas por nome |
| idx_organizations_slug | slug | btree | Otimizar buscas por slug |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| (N/A) | (N/A) | (N/A) | (N/A) | (N/A) |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_admin_access`
   - **Tipo:** ALL
   - **Usando:** `is_admin()`
   - **Descrição:** Permite acesso total para administradores StarIAup para gerenciamento da agência.

2. **Nome:** `restrict_organization_access`
   - **Tipo:** SELECT
   - **Usando:** `auth.uid() IN (SELECT id FROM profiles WHERE organization_id = organizations.id)`
   - **Descrição:** Garante que usuários só possam visualizar informações da própria organização.

---

### Tabela: `profiles`

**Descrição:** Armazena informações sobre os usuários do CRM, vinculados a uma organização e ao sistema de autenticação do Supabase.
**Tipo:** Core

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | auth.uid() | UUID do usuário, vinculado diretamente ao auth.users do Supabase |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| updated_at | timestamptz | NOT NULL | now() | Última atualização do registro |
| organization_id | uuid | NOT NULL | - | ID da organização à qual o usuário pertence |
| full_name | text | - | - | Nome completo do usuário |
| role | text | NOT NULL | 'broker' | Role do usuário dentro da organização (admin, manager, broker) |
| avatar_url | text | - | - | URL da foto do perfil |
| notification_preferences | jsonb | - | - | Preferências de notificação do usuário |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_profiles_organization_id | organization_id | btree | Otimizar buscas de usuários por organização |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| organization_id | organizations | id | CASCADE | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_own_profile_access`
   - **Tipo:** ALL
   - **Usando:** `auth.uid() = id`
   - **Descrição:** Permite que o usuário acesse e modifique seu próprio registro.

2. **Nome:** `allow_organization_profiles_access`
   - **Tipo:** SELECT
   - **Usando:** `auth.uid() IN (SELECT id FROM profiles WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))`
   - **Descrição:** Permite que usuários de uma organização vejam outros usuários da mesma organização.

3.  **Nome:** `allow_manager_profile_management`
     - **Tipo:** INSERT, UPDATE, DELETE
     - **Usando:** `has_role('manager') AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
     - **Descrição:** Permite que managers criem, atualizem e deletem perfis dentro da sua própria organização.

---

### Tabela: `leads`

**Descrição:** Armazena informações sobre potenciais clientes (leads), seus detalhes de contato, status e histórico de interações.
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único do lead |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| updated_at | timestamptz | NOT NULL | now() | Última atualização do registro |
| organization_id | uuid | NOT NULL | - | ID da organização à qual o lead pertence |
| full_name | text | NOT NULL | - | Nome completo do lead |
| email | text | - | - | Endereço de email do lead |
| phone | text | - | - | Número de telefone do lead |
| source | text | - | - | Origem do lead (website, referral, etc.) |
| status | text | NOT NULL | 'new' | Status atual do lead |
| classification | text | NOT NULL | 'lead' | Classificação do contato (lead, client, archived) |
| last_contact_at | timestamptz | - | - | Data do último contato |
| summary | text | - | - | Resumo ou notas sobre o lead |
| owner_id | uuid | - | - | Usuário responsável por este lead (broker/agente) |
| pipeline_step | integer | - | - | Etapa do pipeline de vendas (sincronizado com status) |
| budget | numeric | - | - | Orçamento estimado do lead |
| ltv | numeric | - | 0.00 | Lifetime Value projetado |
| converted_at | timestamptz | - | - | Data de conversão para cliente |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_leads_organization_id | organization_id | btree | Otimizar buscas de leads por organização |
| idx_leads_classification | classification | btree | Otimizar filtros por classificação |
| idx_leads_owner_id | owner_id | btree | Otimizar buscas de leads por responsável |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| organization_id | organizations | id | CASCADE | CASCADE |
| owner_id | profiles | id | SET NULL | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_leads_access`
   - **Tipo:** SELECT
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
   - **Descrição:** Permite que usuários de uma organização acessem leads da própria organização.

2. **Nome:** `allow_lead_management`
   - **Tipo:** INSERT, UPDATE, DELETE
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()) AND (has_role('manager') OR has_role('broker'))`
   - **Descrição:** Permite que usuários gerenciem leads da sua organização.

---

### Tabela: `clients`

**Descrição:** Armazena informações sobre clientes convertidos, seus detalhes de contato, histórico de compras e LTV.
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único do cliente |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| updated_at | timestamptz | NOT NULL | now() | Última atualização do registro |
| organization_id | uuid | NOT NULL | - | ID da organização à qual o cliente pertence |
| lead_id | uuid | UNIQUE | - | ID do lead original que foi convertido para este cliente (opcional) |
| name | text | NOT NULL | - | Nome completo do cliente |
| email | text | - | - | Endereço de email do cliente |
| phone | text | - | - | Número de telefone do cliente |
| address | text | - | - | Endereço do cliente |
| ltv | numeric | - | 0.00 | Lifetime Value real do cliente |
| classification | text | NOT NULL | 'client' | Classificação do contato (lead, client, archived) |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_clients_organization_id | organization_id | btree | Otimizar buscas de clientes por organização |
| idx_clients_lead_id | lead_id | btree | Otimizar buscas e garantir unicidade por lead original |
| idx_clients_classification | classification | btree | Otimizar filtros por classificação |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| organization_id | organizations | id | CASCADE | CASCADE |
| lead_id | leads | id | SET NULL | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_clients_access`
   - **Tipo:** SELECT
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
   - **Descrição:** Permite que usuários de uma organização acessem clientes da própria organização.

2. **Nome:** `allow_client_management`
   - **Tipo:** INSERT, UPDATE, DELETE
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()) AND has_role('manager')`
   - **Descrição:** Permite que gerentes criem, atualizem e deletem clientes dentro da sua própria organização.

---

### Tabela: `properties`

**Descrição:** Armazena informações sobre imóveis gerenciados pelas agências, incluindo detalhes, status e associações.
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único do imóvel |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| updated_at | timestamptz | NOT NULL | now() | Última atualização do registro |
| organization_id | uuid | NOT NULL | - | ID da organização à qual o imóvel pertence |
| address_street | text | - | - | Logradouro |
| address_number | text | - | - | Número |
| address_city | text | - | - | Cidade |
| address_state | text | - | - | Estado |
| address_zip | text | - | - | CEP |
| property_type | text | NOT NULL | 'apartment' | Tipo do imóvel (e.g., apartment, house) |
| price | numeric | NOT NULL | 0.00 | Preço de venda/aluguel do imóvel |
| bedrooms | integer | - | 0 | Número de quartos |
| bathrooms | numeric | - | 0.0 | Número de banheiros |
| area_sqft | numeric | - | 0.00 | Área em m2 |
| description | text | - | - | Descrição detalhada do imóvel |
| status | text | NOT NULL | 'available' | Status do imóvel (available, under_offer, sold) |
| images_urls | text[] | - | - | Lista de URLs das imagens |
| features | text[] | - | - | Lista de características/amenities |
| tarja_texto | text | - | - | Texto da tarja de marketing |
| tarja_cor | text | - | - | Cor da tarja de marketing |
| mostrar_endereco | boolean | - | false | Flag de visibilidade do endereço |
| mostrar_bairro | boolean | - | false | Flag de visibilidade do bairro |
| mostrar_preco | boolean | - | true | Flag de visibilidade do preço |
| accept_exchange | boolean | - | false | Se aceita permuta |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_properties_organization_id | organization_id | btree | Otimizar buscas de imóveis por organização |
| idx_properties_status | status | btree | Otimizar filtros por status do imóvel |
| idx_properties_price | price | btree | Otimizar buscas por faixa de preço |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| organization_id | organizations | id | CASCADE | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_properties_access`
   - **Tipo:** SELECT
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
   - **Descrição:** Permite que usuários de uma organização acessem imóveis da própria organização.

2. **Nome:** `allow_property_management`
   - **Tipo:** INSERT, UPDATE, DELETE
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()) AND has_role('manager')`
   - **Descrição:** Permite que gerentes criem, atualizem e deletem imóveis da sua organização.

---

### Tabela: `lead_property_interest`

**Descrição:** Tabela de junção para registrar o interesse de leads/clientes em imóveis.
**Tipo:** Auxiliar

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| lead_id | uuid | NOT NULL | - | ID do lead |
| property_id | uuid | NOT NULL | - | ID do imóvel |
| created_at | timestamptz | NOT NULL | now() | Data de registro do interesse |
| interest_level | text | - | 'medium' | Nível de interesse (e.g., low, medium, high) |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_lpi_lead_id | lead_id | btree | Otimizar buscas de interesses por lead |
| idx_lpi_property_id | property_id | btree | Otimizar buscas de interesses por imóvel |
| idx_lpi_unique | lead_id, property_id | UNIQUE | Garante que um lead não registre interesse no mesmo imóvel múltiplas vezes |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| lead_id | leads | id | CASCADE | CASCADE |
| property_id | properties | id | CASCADE | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_lpi_access`
   - **Tipo:** SELECT
   - **Usando:** `lead_id IN (SELECT id FROM leads WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))`
   - **Descrição:** Permite que usuários de uma organização vejam interesses de leads da própria organização.

2. **Nome:** `allow_lpi_management`
   - **Tipo:** INSERT, UPDATE, DELETE
   - **Usando:** `lead_id IN (SELECT id FROM leads WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())) AND has_role('manager')`
   - **Descrição:** Permite que gerentes gerenciem interesses de leads da sua organização.

---

### Tabela: `messages` (LEGACY - Em migração para `n8n_historico_mensagens`)

**Descrição:** Armazena mensagens de chat interno ou histórico legado. **Recomenda-se utilizar `n8n_historico_mensagens` para integrações de WhatsApp.**
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único da mensagem |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| lead_id | uuid | NOT NULL | - | ID do lead ao qual a mensagem está associada |
| sender | text | NOT NULL | - | Quem enviou a mensagem ('user' ou 'lead') |
| content | text | NOT NULL | - | Conteúdo da mensagem |
| is_read | boolean | NOT NULL | false | Indica se a mensagem foi lida pelo usuário |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_messages_lead_id | lead_id | btree | Otimizar buscas de mensagens por lead |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| lead_id | leads | id | CASCADE | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_messages_access`
   - **Tipo:** SELECT
   - **Usando:** `lead_id IN (SELECT id FROM leads WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))`
   - **Descrição:** Permite que usuários de uma organização vejam mensagens de leads da própria organização.

2. **Nome:** `allow_message_management`
   - **Tipo:** INSERT
   - **Usando:** `lead_id IN (SELECT id FROM leads WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))`
   - **Descrição:** Permite que usuários de uma organização enviem mensagens para leads da própria organização.

---
### Tabela: `activities`

**Descrição:** Armazena um log de atividades e eventos do sistema para rastreamento de histórico e auditoria.
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único da atividade |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| organization_id | uuid | NOT NULL | - | ID da organização à qual a atividade pertence |
| user_id | uuid | - | - | ID do usuário que executou a ação (null para ações do sistema) |
| entity_type | text | NOT NULL | - | Tipo de entidade afetada (lead, property, client, message) |
| entity_id | uuid | NOT NULL | - | ID da entidade afetada |
| action_type | text | NOT NULL | - | Tipo de ação (create, update, archive, delete, status_change, message) |
| description | text | NOT NULL | - | Descrição legível da atividade |
| metadata | jsonb | - | '{}'::jsonb | Metadados adicionais da atividade |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_activities_organization_id | organization_id | btree | Otimizar buscas de atividades por organização |
| idx_activities_created_at | created_at | btree (DESC) | Otimizar ordenação cronológica reversa |
| idx_activities_entity | entity_type, entity_id | btree | Otimizar buscas de atividades por entidade específica |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| organization_id | organizations | id | CASCADE | CASCADE |
| user_id | profiles | id | SET NULL | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_activities_access`
   - **Tipo:** SELECT
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
   - **Descrição:** Permite que usuários de uma organização vejam atividades da própria organização.

2. **Nome:** `allow_activity_insert`
   - **Tipo:** INSERT
   - **Usando:** `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
   - **Descrição:** Permite que usuários de uma organização criem registros de atividade.

### Triggers
**Trigger:** `trigger_log_lead_activity`
- **Tabela:** `leads`
- **Evento:** AFTER INSERT OR UPDATE
- **Função:** `log_lead_activity()`
- **Descrição:** Registra automaticamente atividades de criação de leads, mudanças de status e conversões para cliente.

**Trigger:** `trigger_log_property_activity`
- **Tabela:** `properties`
- **Evento:** AFTER INSERT OR UPDATE
- **Função:** `log_property_activity()`
- **Descrição:** Registra automaticamente atividades de criação de imóveis e mudanças de status.

---

### Tabela: `n8n_historico_mensagens`

**Descrição:** Armazena o histórico completo de mensagens do WhatsApp (recebidas e enviadas), mantendo o contexto para a IA e permitindo que corretores visualizem e enviem mensagens através do CRM.
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | integer | PRIMARY KEY | auto-increment | Identificador único da mensagem |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| session_id | text | NOT NULL | - | Identificador da sessão (número de telefone do contato) |
| message | jsonb | NOT NULL | - | Objeto da mensagem contendo `type` ('human' ou 'ai') e `content` (texto) |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_n8n_messages_session | session_id | btree | Otimizar buscas de mensagens por sessão/contato |
| idx_n8n_messages_created | created_at | btree (DESC) | Otimizar ordenação cronológica |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| (N/A) | (N/A) | (N/A) | (N/A) | (N/A) |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_organization_chat_access`
   - **Tipo:** SELECT
   - **Usando:** `session_id IN (SELECT phone FROM leads WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))`
   - **Descrição:** Permite que usuários vejam mensagens de leads da própria organização.

2. **Nome:** `allow_chat_insert`
   - **Tipo:** INSERT
   - **Usando:** `session_id IN (SELECT phone FROM leads WHERE organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))`
   - **Descrição:** Permite que usuários enviem mensagens para leads da própria organização.

### Triggers
**Trigger:** `trigger_notify_new_message`
- **Tabela:** `n8n_historico_mensagens`
- **Evento:** AFTER INSERT
- **Função:** `notify_new_message()`
- **Descrição:** Cria automaticamente uma notificação para o corretor responsável quando o lead envia uma nova mensagem.

---

### Tabela: `notifications`

**Descrição:** Armazena notificações para alertar usuários sobre eventos importantes (novas mensagens, mudanças de status, etc.).
**Tipo:** Feature

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | Identificador único da notificação |
| created_at | timestamptz | NOT NULL | now() | Data de criação do registro |
| user_id | uuid | NOT NULL | - | ID do usuário destinatário |
| type | text | NOT NULL | - | Tipo de notificação (new_message, status_change, etc.) |
| title | text | NOT NULL | - | Título da notificação |
| message | text | - | - | Mensagem detalhada |
| is_read | boolean | NOT NULL | false | Indica se a notificação foi lida |
| entity_type | text | - | - | Tipo de entidade relacionada (lead, property, etc.) |
| entity_id | uuid | - | - | ID da entidade relacionada |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_notifications_user_id | user_id | btree | Otimizar buscas de notificações por usuário |
| idx_notifications_is_read | is_read | btree | Otimizar filtros por status de leitura |
| idx_notifications_created_at | created_at | btree (DESC) | Otimizar ordenação cronológica |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| user_id | profiles | id | CASCADE | CASCADE |

### RLS (Row Level Security)
**Status:** Habilitado

**Políticas:**
1. **Nome:** `allow_own_notifications_access`
   - **Tipo:** SELECT
   - **Usando:** `user_id = auth.uid()`
   - **Descrição:** Permite que usuários vejam apenas suas próprias notificações.

2. **Nome:** `allow_own_notifications_update`
   - **Tipo:** UPDATE
   - **Usando:** `user_id = auth.uid()`
   - **Descrição:** Permite que usuários marquem suas próprias notificações como lidas.

---
