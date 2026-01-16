# Épico: [Nome do Épico]

> **Resumo Executivo:**
> *Escreva aqui uma ou duas frases que descrevem o épico, seu objetivo principal e o valor que ele entrega para o usuário e para o negócio. Ex: "Este épico abrange a criação do fluxo completo de onboarding e perfil inicial do usuário, permitindo que o NutriPlan colete as informações essenciais para gerar um plano de refeições personalizado e ativando o usuário pela primeira vez."*

- **ID:** `EPC-XX`
- **PRD Pai:** `[Link para o PRD]`
- **Responsável (Squad/Time):** `[Nome do Time]`
- **Status:** `[A Fazer | Em Andamento | Concluído]`

---

## 1. Problema e Justificativa (O Porquê)
*Descreva o problema do usuário ou a oportunidade de negócio que este épico resolve. Por que estamos fazendo isso agora? Qual dor estamos curando? Utilize dados de pesquisa, se disponíveis.*

**Objetivos de Negócio Relacionados:**
- `[Link para o OKR ou Objetivo de Negócio do PRD que este épico ajuda a atingir]`

## 2. Critérios de Sucesso (Como Mediremos o Sucesso)
*Liste as métricas e KPIs que indicarão que este épico foi um sucesso. Elas devem ser mensuráveis e diretamente relacionadas aos objetivos.*

- **Métrica 1:** (Ex: Aumentar a taxa de ativação de novos usuários em 15%)
- **Métrica 2:** (Ex: Reduzir a taxa de abandono no fluxo de cadastro em 20%)
- **Métrica 3:** (Ex: Atingir uma nota de usabilidade (SUS) de 75 para o fluxo de onboarding)

## 3. Requisitos Funcionais (O Quê)
*Descreva em alto nível as capacidades e funcionalidades que serão implementadas. O que o usuário poderá fazer no final?*

- **Capacidade 1:** (Ex: O usuário pode se cadastrar usando e-mail/senha ou conta Google)
- **Capacidade 2:** (Ex: O usuário pode preencher um formulário com seus dados físicos, preferências alimentares e metas)
- **Capacidade 3:** (Ex: O sistema valida as informações do formulário em tempo real para evitar erros)

## 4. Requisitos Não-Funcionais (Critérios de Qualidade)
*Defina os critérios de qualidade e restrições que o épico deve atender. São tão importantes quanto os requisitos funcionais.*

- **Performance:** (Ex: Todas as telas do fluxo de onboarding devem carregar em menos de 1.5 segundos em uma conexão 3G)
- **Segurança:** (Ex: As senhas dos usuários devem ser armazenadas utilizando o algoritmo de hash Argon2)
- **Usabilidade:** (Ex: O fluxo deve ser 100% navegável via teclado e seguir as diretrizes WCAG 2.1 nível AA de acessibilidade)
- **Legais/Compliance:** (Ex: O fluxo deve apresentar um checkbox de aceite dos Termos de Serviço e da Política de Privacidade, em conformidade com a LGPD, antes de permitir a criação da conta)

## 5. Experiência do Usuário (UX/UI)
*Centralize aqui os artefatos de design para garantir que todo o time esteja alinhado com a experiência proposta.*

- **Fluxo do Usuário:** `[Link para o Miro, Figma, etc.]`
- **Wireframes / Protótipo de Baixa Fidelidade:** `[Link para o Figma, etc.]`
- **Protótipo de Alta Fidelidade / Design Visual:** `[Link para o Figma, etc.]`

## 6. Escopo e User Stories
*Liste todas as histórias de usuário necessárias para completar este épico. Esta tabela serve como um dashboard do progresso.*

| ID | User Story | Prioridade | Status | Link |
|:---|:---|:---|:---|:---|
| US-001 | *Como um novo usuário, eu quero poder me cadastrar com e-mail e senha...* | `Must Have` | `A Fazer` | `[Link]` |
| US-002 | *Como um novo usuário, eu quero poder me cadastrar usando minha conta Google...* | `Should Have` | `A Fazer` | `[Link]` |
| US-003 | *Como um usuário se cadastrando, quero ver validações em tempo real nos campos...* | `Must Have` | `A Fazer` | `[Link]` |
| US-004 | *Como um novo usuário, quero preencher meu perfil com minhas metas e restrições...* | `Must Have` | `A Fazer` | `[Link]` |

## 7. Notas e Considerações Técnicas
*Espaço para o Tech Lead e o time de engenharia documentarem decisões arquiteturais, dependências entre componentes, integrações com outras APIs, estratégias de deploy, etc.*

- *(Ex: Este épico exigirá a criação de uma nova tabela `user_profiles` no banco de dados.)*
- *(Ex: A autenticação via Google será implementada utilizando a biblioteca `passport.js` e o protocolo OAuth 2.0.)*
- *(Ex: Os dados de perfil serão expostos através de um novo endpoint na API: `GET /api/v1/users/me`)*