## 🎯 FASE 2: Inventário (Core)

### PRP-002: Inventory & Properties CRUD

**Objetivo:** Implementar o coração do sistema: o CRUD de Imóveis (Tabela `properties`) com isolamento RLS, upload de imagens e interface de listagem de alta densidade.

---

#### ✅ Checklist de Completude (Validar antes de executar)

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
- [ ] **Badge de Status:** `Disponível` (Verde), `Reservado` (Amarelo), `Vendido` (Vermelho).
- [ ] **Image Upload:** Dropzone com preview e upload direto para Supabase Storage.
- [ ] **Currency Input:** Input mascarado para valores monetários (BRL).

**4. Interações e Comportamento**
- [ ] **Optimistic UI:** Ao arquivar um imóvel, ele some da lista instantaneamente.
- [ ] **Infinite Scroll:** Paginação por cursor na listagem.
- [ ] **Search:** Busca full-text (título e descrição) com debounce.

**5. Integração com Backend**
- [ ] **Tabela `properties`:** Usar schema definido no `database_inventory.md`.
- [ ] **Storage:** Bucket `property-images` (privado/autenticado).
- [ ] **RLS Policies:** `SELECT/INSERT/UPDATE` apenas por membros da mesma `organization_id`.

---

#### 📋 Especificação Técnica

**Arquitetura de Pastas:**
- `src/app/dashboard/properties/page.tsx`: Listagem Master.
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

*Criado em: 2026-01-06*
*Autor: 07 - Helena*
