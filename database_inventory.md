# Database Inventory v2.0 - CRM Imobiliário

**Gerado por:** 02 - Sofia (CTO)
**SSOT:** Este documento é a única fonte de verdade para o schema do banco de dados.

---

## 1. Core Structure

### 🏢 `organizations` (Imobiliárias)
| Coluna | Tipo | Default | Notas |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `gen_random_uuid()` | PK |
| `name` | `text` | | |
| `slug` | `text` | | Unique, URL-friendly |
| `subscription_status`| `text` | `'active'` | `active`, `inactive`, `blocked` |
| `plan_id` | `text` | `'free'` | FK para definição de tiers |
| `whatsapp_automated` | `boolean` | `false` | Checkbox do PO |
| `whatsapp_type` | `text` | | `oficial`, `nao_oficial` |
| `token_id` | `text` | | Para API Não Oficial |
| `instance_id` | `text` | | Para API Não Oficial |
| `created_at` | `timestamptz`| `now()` | |
| `updated_at` | `timestamptz`| `now()` | |

### 👤 `profiles` (Usuários / Corretores)
| Coluna | Tipo | Default | Notas |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | | PK (FK de `auth.users`) |
| `organization_id` | `uuid` | | FK `organizations.id` |
| `full_name` | `text` | | |
| `role` | `text` | `'agent'` | `super_admin`, `admin`, `agent` |
| `avatar_url` | `text` | | |

---

## 2. Business Data (Isolado por RLS)

### 🏠 `properties` (Imóveis & Lançamentos)
*Mescla lógica do `banco_imoveis` do PO.*

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | PK |
| `organization_id` | `uuid` | FK (RLS Boundary) |
| `condominio_id` | `uuid` | FK self-referencing (null = parent/avulso) |
| `title` | `text` | |
| `description` | `text` | |
| `type` | `text` | `apartamento`, `casa`, `terreno`, etc |
| `transaction_type`| `text` | `venda`, `aluguel` |
| `status` | `text` | `disponivel`, `vendido`, `alugado` |
| `price` | `decimal` | |
| `bedrooms` | `int` | |
| `suites` | `int` | |
| `bathrooms` | `int` | |
| `area_m2` | `text` | Info textual conforme PO |
| `area_privativa` | `text` | Info textual conforme PO |
| `area_construida` | `text` | Info textual conforme PO |
| `parking_spaces` | `int` | |
| `andar` | `int` | |
| `total_andares` | `int` | |
| `unidades_por_andar`|`int`| |
| `address_logradouro`|`text`| |
| `address_number` | `text` | |
| `address_bairro` | `text` | |
| `address_city` | `text` | |
| `address_state` | `text` | |
| `address_cep` | `text` | |
| `iptu` | `text` | |
| `condominio_fee` | `text` | |
| `aceita_financiamento`|`bool`| |
| `accept_exchange` | `bool` | |
| `mostrar_endereco` | `bool` | Toggle de visibilidade |
| `mostrar_bairro` | `bool` | Toggle de visibilidade |
| `mostrar_preco` | `bool` | Toggle de visibilidade |
| `tipo_negociacao` | `text` | `publico`, `privado` |
| `images_urls` | `text[]`| |
| `features` | `text[]`| Tags (caracteristicas_imovel) |
| `tarja_texto` | `text` | Label de marketing |
| `tarja_cor` | `text` | Hex ou color name |
| `corretor_id` | `uuid` | FK `profiles.id` (Responsável) |
| `internal_notes` | `text` | anotacoes_internas |
| `search_vector` | `tsvector`| Para RAG e busca textual |

### 📈 `leads` (Potenciais Clientes)
*Mescla lógica do `banco_clientes` do PO.*

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | PK |
| `organization_id` | `uuid` | FK |
| `full_name` | `text` | |
| `phone` | `text` | unique per organization |
| `source` | `text` | `landing_page`, `whatsapp`, `manual` |
| `status` | `text` | `novo`, `qualificado`, `negociando`, `pos_venda` |
| `last_contact_at` | `timestamptz` | `ultimo_contato` do banco_clientes |
| `summary` | `text` | `resumo` do banco_clientes |
| `pipeline_step` | `int` | Posição no Kanban |

---

## 3. n8n & Follow-up Infrastructure

Herdamos as tabelas existentes do PO para manter retrocompatibilidade com as automações de prod.

### 🕒 `fup_status` (Follow-up Tracking)
- **whatsapp** (VARCHAR, Unique)
- **status** (aguardando_resposta, fup1, fup2, fup3, fup4)
- **hora_mensagem** (timestamp)
- **nome**, **resposta_iana**, **mensagem_lead**

### 💬 WhatsApp Engine
- `n8n_historico_mensagens`: JSONB logs com trigger de `created_at`.
  - **⚠️ CRITICAL (Future Official DB):** Esta tabela precisa de uma coluna `organization_id` (uuid, FK `organizations.id`) para permitir filtragem multi-tenant no Chat UI. Atualmente, o DB "VANESSA" (teste) não possui essa coluna, então o filtro é feito via JOIN com `leads.phone`. Na migração para produção, adicionar essa coluna é **MANDATÓRIO** para evitar vazamento de conversas entre imobiliárias.
- `n8n_fila_mensagens`: Fila de saída.
- `keepalive`: Tabela técnica para evitar pausa do projeto Supabase.

---

## 4. RLS - Segurança & Multi-Tenancy

### Regras Mandatórias:
1. **SELECT/UPDATE/INSERT/DELETE:** Permitido apenas se `organization_id == auth.jwt() -> 'organization_id'`.
2. **Corretor vs Admin:** Role `agent` não pode alterar a tabela `organizations` ou `profiles` (exceto o próprio).
3. **Imagens:** Buckets no Supabase Storage também protegidos por prefixo de `organization_id`.

---

## 5. Webhooks & Background Jobs
- **Tabela `leads` (AFTER INSERT):** Database Trigger -> `net.http_post` para URL de entrada do N8N.
- **Folow-up Cron:** `pg_cron` agendado conforme `sql-tables-n8n.md` para disparar webhooks comercialmente (Seg-Sex 8h-20h, Sáb 9h-15h).
