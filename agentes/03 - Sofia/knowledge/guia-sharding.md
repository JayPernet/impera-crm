# Guia de Sharding - Fragmentação de Documentos

Este guia explica como quebrar documentos grandes (PRD, PRPs) em partes gerenciáveis para execução eficiente com IA.

---

## 🎯 Objetivo do Sharding

**Problema:**
- Documentos muito grandes (> 2000 linhas) sobrecarregam o contexto da IA
- Dificulta manutenção e atualização
- Aumenta risco de inconsistências

**Solução:**
- Quebrar em módulos independentes e coesos
- Cada fragmento deve ser autocontido
- Manter rastreabilidade entre fragmentos

---

## 📏 Critérios de Fragmentação

### PRD (Product Requirements Document)

**Quebrar por Épico:**
- Cada Épico vira um documento separado
- Formato: `prd-[numero]-[nome-epico].md`
- Exemplo: `prd-001-autenticacao.md`, `prd-002-dashboard.md`

**Estrutura de cada fragmento:**
```markdown
# PRD-[N]: [Nome do Épico]

## Contexto
- Link para PRD Master
- Dependências de outros épicos

## Requisitos Funcionais (FRs)
[Lista específica deste épico]

## Requisitos Não-Funcionais (NFRs)
[Lista específica deste épico]

## Histórias de Usuário
[Lista específica deste épico]

## Regras de Negócio
[Específicas deste épico]

## Critérios de Aceitação
[Checklist de validação]
```

---

### PRP (Product Requirement Prompt)

**Quebrar por Feature/Tela:**
- Cada tela ou funcionalidade vira um PRP
- Formato: `[numero]-prp-[nome-feature].md`
- Exemplo: `001-prp-tela-login.md`, `002-prp-modal-recuperacao-senha.md`

**Limite de tamanho:**
- Máximo: 1500 linhas por PRP
- Se ultrapassar: quebrar em sub-features
- Exemplo: `002a-prp-dashboard-graficos.md`, `002b-prp-dashboard-tabelas.md`

**Estrutura de dependências:**
```markdown
## Relacionamentos

**Depende de:**
- PRP-001: Login (precisa estar concluído)
- Tabela: `portal_users` (ver Inventário)

**Bloqueia:**
- PRP-003: Dashboard (depende desta feature)
```

---

### Inventário de Database

**Quebrar por categoria:**
- Core Tables: `inventario-core-tables.md`
- Feature Tables: `inventario-feature-tables.md`
- Marketing & Assets: `inventario-marketing-tables.md`
- Academy: `inventario-academy-tables.md`

**OU quebrar por domínio:**
- Auth & Users: `inventario-auth.md`
- Tasks & Projects: `inventario-tasks.md`
- Communication: `inventario-communication.md`

**Manter um Master:**
- `inventario-master.md` com links para todos os fragmentos
- Índice de todas as tabelas com link direto

---

## 🔗 Sistema de Referência Cruzada

**Cada fragmento deve ter:**

```markdown
---
**Documento:** [Tipo]-[Número]-[Nome]
**Parte de:** [Documento Master]
**Versão:** [X.Y.Z]
**Atualizado em:** [Data]
---

## Navegação

⬅️ Anterior: [Link para documento anterior]
➡️ Próximo: [Link para próximo documento]
⬆️ Master: [Link para documento master]

## Dependências

**Requer:**
- [Lista de documentos/features necessários]

**Relacionado:**
- [Lista de documentos correlatos]
```

---

## 📦 Estrutura de Pastas Recomendada

```
projeto/
├── docs/
│   ├── 00-briefing.md (se houver)
│   ├── 01-prd/
│   │   ├── prd-master.md
│   │   ├── prd-001-autenticacao.md
│   │   ├── prd-002-dashboard.md
│   │   └── ...
│   ├── 02-inventario/
│   │   ├── inventario-master.md
│   │   ├── inventario-core-tables.md
│   │   ├── inventario-feature-tables.md
│   │   └── ...
│   ├── 03-prps/
│   │   ├── fase-1-fundacao/
│   │   │   ├── 001-prp-tela-login.md
│   │   │   ├── 002-prp-modal-recuperacao.md
│   │   │   └── ...
│   │   ├── fase-2-core/
│   │   │   └── ...
│   │   └── fase-3-avancado/
│   │       └── ...
│   └── 04-templates/
│       ├── checklist-po-validacao.md
│       └── guia-sharding.md
```

---

## ✅ Checklist de Sharding Efetivo

**Antes de fragmentar:**
- [ ] Identifiquei os limites naturais do documento (épicos, features, domínios)
- [ ] Defini convenção de nomenclatura consistente
- [ ] Criei estrutura de pastas organizada

**Durante fragmentação:**
- [ ] Cada fragmento é autocontido (pode ser lido isoladamente)
- [ ] Dependências estão explicitamente documentadas
- [ ] Links de navegação estão funcionais
- [ ] Nenhum fragmento ultrapassa 1500 linhas

**Após fragmentar:**
- [ ] Documento Master indexa todos os fragmentos
- [ ] Sistema de versionamento está ativo
- [ ] Equipe sabe onde encontrar cada informação
- [ ] Processo de atualização está definido

---

## 🔄 Manutenção do Sharding

**Quando atualizar um fragmento:**
1. Atualizar data de modificação no cabeçalho
2. Incrementar versão (patch: X.Y.Z+1)
3. Verificar se outros fragmentos dependem dele
4. Atualizar documento Master se necessário
5. Notificar equipe sobre mudanças

**Quando criar novo fragmento:**
1. Seguir convenção de nomenclatura
2. Adicionar ao índice do Master
3. Documentar dependências
4. Criar links de navegação
5. Adicionar ao controle de versão

---

*Este guia faz parte do Framework de Desenvolvimento com IA*
*Versão: 1.0.0*
*Atualizado em: [Data]*
