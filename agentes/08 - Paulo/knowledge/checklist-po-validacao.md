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
