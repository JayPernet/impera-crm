# Templates Master - Framework de Desenvolvimento

Este documento contém todos os templates necessários para executar o framework de desenvolvimento com IA. Cada seção pode ser salva como arquivo individual.

---

## 1. Template de Inventário de Database

### Estrutura Padrão: `inventario-database.md`

```markdown
# Inventário de Database - [Nome do Projeto]

Este documento mapeia todas as tabelas do schema com prefixo `[prefixo_]`, detalhando colunas, tipos, constraints e relacionamentos.
*(Atualizado em: [Data] às [Hora])*

---

> [!IMPORTANT]  
> **Status de Segurança:** Todas as tabelas listadas possuem **RLS (Row Level Security)** habilitado.
> - `admin`: Acesso total
> - `analyst`: Escopo de time/organização
> - `client`: Escopo de dono (apenas seus dados)

---

## 1. Core Tables (Estruturais)

### [nome_da_tabela]
**Descrição:** [Breve descrição da função da tabela]

**Colunas:**
| Nome | Tipo | Nullable | Default | FK | Observações |
|------|------|----------|---------|-----|-------------|
| id | uuid | NO | gen_random_uuid() | - | Primary key |
| [coluna] | [tipo] | [YES/NO] | [valor] | [tabela(coluna) [ação]] | [nota] |

**Frontend Usage (Payloads):**
- `[Componente.tsx]`: [OPERAÇÃO] ([colunas usadas])
  - [Descrição do uso]
  - [Regras de negócio aplicadas]

**Storage Bucket (se aplicável):**
- Nome: `[nome-do-bucket]`
- Public: [true/false]
- Size limit: [tamanho]
- Allowed types: [tipos permitidos]

**Relacionamentos de Saída (Esta tabela referencia):**
- `[coluna]` -> `[tabela_destino.coluna]` ([ação: CASCADE/SET NULL/NO ACTION])

**Relacionamentos de Entrada (Referenciado por):**
- `[tabela_origem].[coluna]` (ação)

**Índices:**
- `idx_[nome]` on `[coluna(s)]` - [Razão do índice]

**Triggers:**
- `[nome_trigger]`: [Descrição da automação]

---

## 2. Feature Tables (Funcionalidades)

[Repetir estrutura acima para cada grupo de tabelas]

---

## 3. Enums e Types Customizados

### [nome_do_enum]
**Valores:** `'valor1'`, `'valor2'`, `'valor3'`
**Usado em:** `[tabela.coluna]`
**Descrição:** [Significado de cada valor]

---

## 4. Políticas RLS

### [nome_da_tabela]

**Policy: `[nome_policy]`**
- **Operação:** [SELECT/INSERT/UPDATE/DELETE]
- **Role:** [admin/analyst/client]
- **Condição:** `[expressão SQL]`
- **Descrição:** [O que essa policy permite/bloqueia]

---

## 5. Performance Optimization

**Índices Críticos Criados:**
- `[tabela]([coluna])`: Otimiza JOINs em [contexto]
- `[tabela]([coluna1], [coluna2])`: Otimiza queries com filtros combinados

**Observações de Performance:**
- [Notas sobre queries lentas evitadas]
- [Recomendações de uso]

---

*Gerado via [Ferramenta] - [Data e Hora]*
```

---

## 2. Template de Épico

### Estrutura Padrão: `epico-[numero]-[nome-epico].md`

**Exemplo:** `epico-001-autenticacao.md`, `epico-002-dashboard.md`

```markdown
# ÉPICO-[XXX]: [Nome do Épico]

**Status:** [Backlog / Planejado / Em Desenvolvimento / Concluído]  
**Prioridade:** [Must Have / Should Have / Could Have / Won't Have]  
**Versão:** 1.0.0  
**Criado em:** [Data]  
**Atualizado em:** [Data]

---

## 📋 Contexto e Objetivo

**Problema que resolve:**
[Descreva o problema ou necessidade que este épico atende]

**Objetivo do negócio:**
[Qual o valor de negócio? Por que isso é importante agora?]

**Resultado esperado:**
[O que consideramos como sucesso? Métricas de validação]

---

## 👥 Personas Impactadas

| Persona | Como são impactadas | Benefício principal |
|---------|---------------------|---------------------|
| [Nome da persona 1] | [Descrição] | [Benefício] |
| [Nome da persona 2] | [Descrição] | [Benefício] |

---

## 📖 Histórias de Usuário

### História 1: [Título da História]
**Como** [tipo de usuário],  
**Eu quero** [realizar alguma ação],  
**Para que** [alcançar algum benefício/objetivo].

**Critérios de Aceitação:**
- [ ] [Critério 1]
- [ ] [Critério 2]
- [ ] [Critério 3]

**Notas técnicas:**
- [Considerações de implementação]
- [Integrações necessárias]

---

### História 2: [Título da História]
[Repetir estrutura acima]

---

## ⚙️ Requisitos Funcionais (FRs)

| ID | Descrição | Prioridade | Complexidade |
|----|-----------|------------|--------------|
| FR-[XXX]-001 | [Descrição do requisito funcional] | [Alta/Média/Baixa] | [Alta/Média/Baixa] |
| FR-[XXX]-002 | [Descrição do requisito funcional] | [Alta/Média/Baixa] | [Alta/Média/Baixa] |

**Detalhamento:**

**FR-[XXX]-001: [Nome do requisito]**
- **Descrição completa:** [Explicação detalhada do que o sistema deve fazer]
- **Entradas:** [Dados/inputs necessários]
- **Processamento:** [O que acontece internamente]
- **Saídas:** [Resultado esperado]
- **Regras de negócio:** 
  - [Regra 1]
  - [Regra 2]

---

## 🔧 Requisitos Não-Funcionais (NFRs)

| ID | Categoria | Descrição | Métrica de Sucesso |
|----|-----------|-----------|-------------------|
| NFR-[XXX]-001 | Performance | [Ex: Tempo de resposta] | [Ex: < 2 segundos] |
| NFR-[XXX]-002 | Segurança | [Ex: Criptografia de dados] | [Ex: AES-256] |
| NFR-[XXX]-003 | Usabilidade | [Ex: Acessibilidade WCAG] | [Ex: Nível AA] |

**Detalhamento:**

**NFR-[XXX]-001: [Nome do requisito]**
- **Descrição:** [Explicação detalhada]
- **Justificativa:** [Por que isso é importante]
- **Como medir:** [Ferramentas/métodos de validação]
- **Impacto se não atendido:** [Consequências]

---

## ✅ Critérios de Aceitação (Épico)

**Este épico será considerado concluído quando:**
- [ ] Todas as histórias de usuário foram implementadas
- [ ] Todos os FRs foram atendidos
- [ ] Todos os NFRs foram validados
- [ ] Testes de QA foram aprovados
- [ ] Documentação foi atualizada
- [ ] [Critério específico 1]
- [ ] [Critério específico 2]

**Cenários de teste críticos:**
1. [Cenário de teste end-to-end 1]
2. [Cenário de teste end-to-end 2]

---

## 🔗 Dependências

**Este épico depende de:**
- ÉPICO-[XXX]: [Nome do épico] - [Razão da dependência]
- Integração com: [Sistema/API externa]
- Infraestrutura: [Requisitos de infra]

**Este épico bloqueia:**
- ÉPICO-[XXX]: [Nome do épico] - [Razão]

**Tabelas de banco necessárias (ver Inventário):**
- `[nome_tabela_1]`: [Descrição do uso]
- `[nome_tabela_2]`: [Descrição do uso]

---

## 🎯 Prioridade (MoSCoW)

**Classificação:** [Must Have / Should Have / Could Have / Won't Have]

**Justificativa:**
[Por que esta prioridade foi atribuída? Qual o impacto no negócio/usuário se não for feito?]

**Trade-offs considerados:**
- [Alternativa 1 vs escolha final]
- [Alternativa 2 vs escolha final]

---

## ⏱️ Estimativa

**Complexidade:** [Alta / Média / Baixa]

**Estimativa de esforço:**
- Design (UX/UI): [X dias/horas]
- Desenvolvimento Frontend: [X dias/horas]
- Desenvolvimento Backend: [X dias/horas]
- QA/Testes: [X dias/horas]
- **Total estimado:** [X dias/horas]

**Premissas da estimativa:**
- [Premissa 1: ex: "Time com 2 desenvolvedores"]
- [Premissa 2: ex: "Sem mudanças de escopo"]

**Riscos que podem impactar o prazo:**
- [Risco 1 e plano de mitigação]
- [Risco 2 e plano de mitigação]

---

## 📸 Referências Visuais (Opcional)

**Mockups/Wireframes:**
- [Link ou anexo]

**Fluxogramas:**
- [Link ou anexo]

**Exemplos de referência:**
- [Screenshots de concorrentes ou inspirações]

---

## 📝 Notas Adicionais

**Considerações técnicas:**
- [Nota técnica relevante 1]
- [Nota técnica relevante 2]

**Feedback de stakeholders:**
- [Data - Nome]: [Comentário/solicitação]

**Histórico de mudanças:**
| Data | Versão | Autor | Mudança |
|------|--------|-------|---------|
| [Data] | 1.0.0 | [Nome] | Criação inicial |
| [Data] | 1.1.0 | [Nome] | [Descrição da mudança] |

---

## 🔄 Relacionamento com PRPs

**Este épico será implementado pelos seguintes PRPs:**
- PRP-[XXX]: [Nome do PRP] - [Feature específica]
- PRP-[XXX]: [Nome do PRP] - [Feature específica]

---

*Este documento faz parte do PRD: [Nome do Projeto]*  
*Responsável: [Nome do PM]*  
*Aprovado por: [Nome do PO]*
```

---

## 3. Template de PRP (Checklist de Qualidade)

### Estrutura Padrão: `[numero]-prp-[feature].md`

**Exemplo:** `001-prp-tela-login.md`

```markdown
## 🎯 FASE [N]: [NOME DA FASE]

### PRP-[XXX]: [Nome da Feature]

**Objetivo:** [Descrição concisa do que será implementado]

---

#### ✅ Checklist de Completude (Validar antes de executar)

**1. Contexto e Escopo**
- [ ] Objetivo da feature está claro
- [ ] Fase do projeto está identificada
- [ ] Dependências de outras features estão mapeadas

**2. Especificações de Layout**
- [ ] Estrutura de componentes definida (containers, grids, seções)
- [ ] Responsividade especificada (breakpoints mobile/tablet/desktop)
- [ ] Estados visuais documentados (loading, error, empty, success)

**3. Detalhamento de Componentes**
- [ ] Cada elemento tem classes Tailwind específicas
- [ ] Estados de hover/focus/active definidos
- [ ] Transições e animações especificadas (duração, easing, keyframes)
- [ ] Ícones e assets referenciados (biblioteca, tamanho, cor)

**4. Interações e Comportamento**
- [ ] Eventos de usuário mapeados (onClick, onChange, onSubmit)
- [ ] Validações de formulário especificadas (regex, mensagens de erro)
- [ ] Feedback visual de ações (loading spinners, toasts, modais)
- [ ] Fluxos de erro e sucesso documentados

**5. Integração com Backend**
- [ ] Endpoints de API especificados (método, rota, payload)
- [ ] Tabelas do banco referenciadas (conforme Inventário)
- [ ] Políticas RLS consideradas (quem pode acessar o quê)
- [ ] Tratamento de erros de API definido

**6. Micro-interações**
- [ ] Animações de entrada/saída de elementos
- [ ] Estados de cursor (pointer, not-allowed, etc.)
- [ ] Feedback tátil (scale, shadow, color changes)
- [ ] Transições entre telas/modais

**7. Acessibilidade**
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] Labels e aria-labels definidos
- [ ] Contraste de cores validado
- [ ] Focus visible para todos elementos interativos

**8. Arquivos e Estrutura**
- [ ] Lista de arquivos a criar/modificar
- [ ] Importações de dependências especificadas
- [ ] Estrutura de pastas definida

---

#### 📋 Especificação Técnica

[Aqui vai o conteúdo detalhado do PRP, seguindo o exemplo do login]

**Layout:**
- [Descrição da estrutura]

**Componentes:**
- [Detalhamento de cada elemento]

**Estados:**
- [Todos os estados possíveis]

**Validações:**
- [Regras de validação]

**Integrações:**
- [APIs e banco de dados]

**Micro-interações:**
- [Animações e feedbacks]

---

#### 🔗 Relacionamentos

**Depende de:**
- PRP-[XXX]: [Nome da feature prerequisito]
- Tabela: `[nome_tabela]` (ver Inventário)

**Bloqueia:**
- PRP-[XXX]: [Features que dependem desta]

---

*Criado em: [Data]*
*Última atualização: [Data]*
```

---

## 4. Master Checklist do PO

### Arquivo: `checklist-po-validacao.md`

```markdown
# Master Checklist do Product Owner

Este checklist valida se o planejamento está completo antes de iniciar o desenvolvimento.

---

## ✅ Fase 1: Pesquisa e Descoberta

**Se houver Briefing:**
- [ ] Análise de mercado foi realizada
- [ ] Concorrentes foram mapeados
- [ ] Público-alvo está definido
- [ ] Proposta de valor está clara
- [ ] Briefing documenta insights acionáveis

**Se não houver Briefing:**
- [ ] PRD foi criado diretamente com informações suficientes

---

## ✅ Fase 2: PRD (Product Requirements Document)

**Requisitos Funcionais (FRs):**
- [ ] Todas as funcionalidades core estão listadas
- [ ] Cada FR tem critério de aceitação claro
- [ ] Fluxos de usuário estão mapeados
- [ ] Casos de uso cobrem cenários principais

**Requisitos Não-Funcionais (NFRs):**
- [ ] Performance esperada está definida (tempo de resposta)
- [ ] Requisitos de segurança estão documentados
- [ ] Escalabilidade está considerada
- [ ] Compatibilidade (browsers, devices) está especificada

**Épicos e Histórias:**
- [ ] Funcionalidades grandes foram quebradas em Épicos
- [ ] Cada Épico tem Histórias de Usuário detalhadas
- [ ] Histórias seguem formato: "Como [persona], eu quero [ação], para [benefício]"
- [ ] Priorização está definida (MoSCoW: Must/Should/Could/Won't)

**Regras de Negócio:**
- [ ] Lógicas críticas estão documentadas
- [ ] Exceções e edge cases estão mapeados
- [ ] Integrações externas estão identificadas

---

## ✅ Fase 3: Design e Arquitetura

**UX (Se aplicável):**
- [ ] Wireframes/mockups foram criados
- [ ] Fluxos de navegação estão claros
- [ ] Especificação de Front-End está completa
- [ ] Prompts de UI para ferramentas foram gerados
- [ ] Design System está definido (cores, tipografia, componentes)

**Arquitetura Técnica:**
- [ ] Stack tecnológico foi escolhido
- [ ] Estrutura de pastas/módulos está definida
- [ ] Integrações de API estão mapeadas
- [ ] Estratégia de deployment está clara

**Inventário de Database:**
- [ ] Todas as tabelas necessárias estão listadas
- [ ] Colunas, tipos e constraints estão especificados
- [ ] Relacionamentos (FKs) estão documentados
- [ ] Políticas RLS estão definidas por role
- [ ] Índices de performance estão identificados
- [ ] Triggers e automações estão documentados
- [ ] Mapeamento frontend (payloads) está completo
- [ ] Storage buckets estão configurados (se aplicável)

---

## ✅ Fase 4: Validação e Refino

**Estratégia de Teste (QA):**
- [ ] Áreas de alto risco foram identificadas
- [ ] Casos de teste críticos foram listados
- [ ] Estratégia de testes automatizados está definida
- [ ] Plano de testes manuais está pronto

**Alinhamento Geral:**
- [ ] PRD e Arquitetura estão sincronizados
- [ ] Não há ambiguidades ou contradições
- [ ] Todos os stakeholders revisaram e aprovaram
- [ ] Estimativas de tempo/esforço estão claras

**PRPs (Product Requirement Prompts):**
- [ ] Todos os Épicos foram traduzidos em PRPs
- [ ] Cada PRP passou pelo Checklist de Qualidade
- [ ] PRPs estão fragmentados (nenhum > 2000 linhas)
- [ ] Dependências entre PRPs estão mapeadas
- [ ] Ordem de execução está definida

---

## ✅ Fase 5: Prontidão para Desenvolvimento

**Documentação Final:**
- [ ] PRD está versionado e acessível
- [ ] Inventário de Database está atualizado
- [ ] PRPs estão organizados e numerados
- [ ] Glossário está completo
- [ ] Crew de especialistas está definido

**Ambiente:**
- [ ] Repositório está criado
- [ ] Ambientes de dev/staging/prod estão configurados
- [ ] Acessos e permissões estão liberados
- [ ] Ferramentas de monitoramento estão ativas

**Transição:**
- [ ] Equipe de desenvolvimento foi briefada
- [ ] Primeira sprint foi planejada
- [ ] Canais de comunicação estão ativos
- [ ] Processo de sincronização (loop) foi explicado

---

## 🔄 Loop de Sincronização (Durante Desenvolvimento)

**A cada mudança não prevista:**
- [ ] PRD foi atualizado
- [ ] Inventário de Database foi atualizado
- [ ] PRP correspondente foi atualizado
- [ ] Stakeholders foram notificados
- [ ] Documentação está em sincronia com código

---

## ❌ Bloqueios Identificados

**Se qualquer item acima estiver incompleto, documente aqui:**

| Fase | Item Pendente | Responsável | Prazo | Status |
|------|---------------|-------------|-------|--------|
| [N] | [Descrição] | [Nome] | [Data] | 🔴 Bloqueado / 🟡 Em Progresso |

---

*Atualizado em: [Data]*
```

---

## 5. Guia de Sharding (Fragmentação de Documentos)

### Arquivo: `guia-sharding.md`

```markdown
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
```

---

# 🎯 Instruções de Uso

Cada seção acima pode ser salva como arquivo individual:

1. **inventario-database.md** - Template para mapear banco de dados
2. **epico-[numero]-[nome-epico].md** - Template para documentar cada Épico do PRD
3. **[numero]-prp-[feature].md** - Template/checklist para PRPs
4. **checklist-po-validacao.md** - Validação antes do desenvolvimento
5. **guia-sharding.md** - Como fragmentar documentos grandes

Todos os templates incluem metadados de versionamento e devem ser atualizados conforme o projeto evolui.
