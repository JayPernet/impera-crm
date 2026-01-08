## 🎯 FASE 2: Inventário (Core)

### PRP-002: Inventory & Properties CRUD

**Objetivo:** Implementar o coração do sistema: o CRUD de Imóveis (Tabela `properties`) com isolamento RLS, upload de imagens e interface de listagem de alta densidade.

---

### 🧠 Validação (Ricardo's Methodology)

**1. A Gambiarra (Workaround):**
*Imobiliárias organizam fotos em pastas do Google Drive compartilhadas e copiam/colam descrições do Bloco de Notas para o WhatsApp.*

**2. O Ódio Tolerado (Pain Point):**
*Corretores perguntam "Esse imóvel ainda tá disponível?" dez vezes ao dia no grupo da imobiliária porque a planilha nunca está atualizada.*

**3. A Customização (Feature Gap):**
*Corretores criam PDFs manuais no Canva toda vez que precisam apresentar um imóvel para um cliente.*

---

### ✍️ Copy Insights (Handover para Pamela)

- **Headline Pain:** "Pare de perguntar no grupo se o imóvel foi vendido."
- **Value Prop:** "Inventário vivo e atualizado. Um link, todas as informações, zero dúvidas."
- **Feature Hero:** "Carteira Digital: Seus imóveis na palma da mão, prontos para vender."

---

#### ✅ Checklist de Completude (Concluído)

**1. Contexto e Escopo**
- [x] Objetivo: Gestão completa de imóveis por organização.
- [x] Dependências: `organizations` e `profiles` (já criados), Storage Buckets.
- [x] Escopo: Listagem, Criação (Wizard/Modal), Edição, Exclusão lógica.

**2. Especificações de Layout**
- [ ] **Data Grid:** Shadcn Table ou TanStack Table para alta densidade.
- [ ] **Filtros:** Sidebar colapsável ou Topbar com filtros avançados (Preço, Tipologia).
- [ ] **Card de Imóvel:** Visualização alternativa em Grid (Cards com carrossel de fotos).
- [ ] **Editor:** Formulário estruturado em etapas (Dados Básicos -> Endereço -> Detalhes -> Mídia).

**3. Detalhamento de Componentes**
- [x] **Badge de Status:** `Disponível`, `Reservado`, `Vendido`, `Alugado`.
- [x] **Image Upload:** Dropzone com preview e upload direto para Storage.
- [x] **Currency Input:** Campo de preço formatado via Zod.

**4. Interações e Comportamento**
- [x] **Optimistic UI:** Ao arquivar um imóvel, ele some da lista instantaneamente.
- [x] **Infinite Scroll:** Paginação por cursor na listagem.
- [x] **Search:** Busca full-text (título e descrição) com debounce.

**5. Integração com Backend**
- [x] **Tabela `properties`:** Usar schema definido no `database_inventory.md`.
- [x] **Storage:** Bucket `properties` configurado.
- [x] **RLS Policies:** Ativas por `organization_id`.

---

#### 📋 Especificação Técnica

**Arquitetura de Pastas:**
- `src/app/dashboard/properties/page.tsx`: Listagem Master.
- `src/app/dashboard/properties/new/page.tsx`: Wizard de Criação.
- `src/app/dashboard/properties/[id]/page.tsx`: Detalhes e Edição.
- `src/app/dashboard/properties/components/`: PropertyCard, PropertyTable, PropertyForm.
- `src/components/ui/data-table.tsx`: Componente base de tabela.

**Componentes-chave:**
- `PropertyCard`: Mostrar foto principal, preço (formatado), tipologia e bairro.
- `PropertyStats`: No topo da lista (Total Ativo, Valor Total em Carteira).

**Storage Policy:**
- Bucket: `properties`
- Path: `/{organization_id}/{property_id}/{uuid}.jpg`
- Policy: `storage.objects.bucket_id = 'properties' AND (storage.foldername(name))[1] = auth.jwt()->>'organization_id'` (Simplificada, validar sintaxe exata).

---

#### 🔗 Relacionamentos

**Depende de:**
- Auth Session (PRP-001)
- Supabase Project Storage

**Bloqueia:**
- PRP-004: Envio de Imóveis no Chat (precisa ter imóveis para enviar)
- Feature "Site da Imobiliária" (usa dados públicos daqui)

---

*Atualizado em: 2026-01-08*
*Autor: 01 - Ricardo (Refatorado)*
