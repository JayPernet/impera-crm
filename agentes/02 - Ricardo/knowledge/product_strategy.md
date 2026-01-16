# Guia de Estratégia de Produto e Boas Práticas

Este guia serve como uma referência para os princípios e métodos que norteiam a criação e evolução de produtos na StarIAup.

---

## 1. A Fundação: Visão e Pesquisa

### 1.1. Visão do Produto
A visão é a nossa "Estrela Norte". É a declaração aspiracional que descreve o impacto que queremos causar no mundo. Ela deve ser inspiradora e guiar todas as nossas decisões.

- **Visão:** O "porquê" de longo prazo. Ex: "Tornar a alimentação saudável e personalizada acessível a todos."
- **Missão:** O "como" alcançaremos a visão. Ex: "Construindo uma plataforma inteligente que cria planos de refeição adaptados às necessidades de cada indivíduo."

### 1.2. Pesquisa e Descoberta (Discovery)
Não construímos produtos com base em achismos. A estratégia começa com um profundo entendimento do problema, do mercado e do usuário.

- **Pesquisa de Usuário (User Research):** O objetivo é entender as "dores", necessidades e o comportamento do usuário, não perguntar quais features ele quer.
  - **Técnicas:** Entrevistas, observação contextual, surveys, personas.
- **Análise Competitiva:** Mapear concorrentes diretos e indiretos para identificar oportunidades, ameaças e diferenciais.

## 2. Definindo o Sucesso: Metas e Métricas

### 2.1. OKRs (Objectives and Key Results)
OKRs alinham a equipe em torno de metas claras e mensuráveis.

- **Objective (Objetivo):** O que queremos alcançar? Deve ser qualitativo, ambicioso e inspirador.
  - *Exemplo:* "Lançar um MVP de sucesso que valide nossa proposta de valor."
- **Key Results (Resultados-Chave):** Como saberemos que alcançamos o objetivo? Devem ser quantitativos e mensuráveis.
  - *Exemplo KR1:* "Atingir uma taxa de retenção de 40% na primeira semana (D7)."
  - *Exemplo KR2:* "Alcançar uma nota de satisfação (CSAT) de 8/10 entre os primeiros 100 usuários."

### 2.2. Métricas que Importam
Foque em métricas acionáveis, que refletem o comportamento real do usuário e o valor do negócio. Evite "métricas de vaidade".

- **Métricas Acionáveis:** Taxa de conversão, retenção, tempo de tarefa, engajamento por feature.
- **Métricas de Vaidade:** Total de downloads, número de registros, page views (sem contexto).

## 3. Da Ideia ao Backlog: User Stories

### 3.1. Escrevendo User Stories de Qualidade
Uma User Story (História de Usuário) descreve uma funcionalidade da perspectiva de quem a deseja.

- **Formato Padrão:** "Como um [TIPO DE USUÁRIO], eu quero [REALIZAR UMA AÇÃO], para que [EU OBTENHA UM BENEFÍCIO]."
- **Critério INVEST:** Histórias devem ser:
  - **I**ndependent (Independentes)
  - **N**egotiable (Negociáveis)
  - **V**aluable (Valiosas)
  - **E**stimable (Estimáveis)
  - **S**mall (Pequenas)
  - **T**estable (Testáveis)

### 3.2. Critérios de Aceitação (Acceptance Criteria)
São as condições que uma história deve satisfazer para ser considerada "concluída". Eles removem a ambiguidade e são a base para os testes.

- **Formato Gherkin:** "Dado [o contexto], Quando [uma ação acontece], Então [o resultado esperado]."
- **Exemplo (Login):**
  - **User Story:** "Como um usuário registrado, eu quero fazer login, para que eu possa acessar meu perfil."
  - **Critério de Aceitação 1:** "Dado que estou na página de login, quando eu insiro meu e-mail e senha corretos e clico em 'Entrar', então eu sou redirecionado para a minha dashboard."
  - **Critério de Aceitação 2:** "Dado que estou na página de login, quando eu insiro uma senha incorreta, então eu vejo a mensagem 'E-mail ou senha inválidos'."

## 4. A Arte da Priorização: Foco no que Gera Mais Valor

Nenhum time tem recursos infinitos. Priorizar é a chave.

### 4.1. Método MoSCoW
Simples e eficaz para alinhar o time sobre o que é crítico.

- **Must Have:** Essencial para a entrega. Sem isso, o produto não funciona ou é ilegal. Inegociável.
- **Should Have:** Importante, mas não vital. A ausência enfraquece o produto, mas não o quebra.
- **Could Have:** Desejável, "nice to have". Melhora a experiência, mas tem baixo impacto se não for feito.
- **Won't Have:** O que foi explicitamente decidido que **não** será feito nesta versão/release.

### 4.2. Método RICE
Framework para priorização mais objetiva e baseada em dados.

- **R**each (Alcance): Quantas pessoas serão impactadas por esta feature em um período de tempo? (Ex: 500 usuários/mês)
- **I**mpact (Impacto): Qual o tamanho do impacto para esses usuários? (Use uma escala: 3 = massivo, 2 = alto, 1 = médio, 0.5 = baixo)
- **C**onfidence (Confiança): Quão confiante você está nas suas estimativas de alcance e impacto? (100%, 80%, 50%)
- **E**ffort (Esforço): Quanto tempo de trabalho (pessoa-semana, story points) isso vai exigir?

**Fórmula: `(Reach × Impact × Confidence) / Effort = Pontuação RICE`**

## 5. Gerenciando o Escopo e o Futuro

### 5.1. O MVP (Minimum Viable Product)
O MVP não é um produto ruim ou incompleto. É a **menor versão do produto que pode ser lançada para entregar valor ao usuário e gerar aprendizado validado para o negócio.**

### 5.2. Roadmapping Estratégico
Um bom roadmap comunica a estratégia, não apenas uma lista de features com datas.

- **Roadmap Baseado em Temas/Objetivos:** Em vez de "Q1: Feature de Login, Feature de Perfil", use "Q1: Foco em Aquisição e Onboarding". Isso dá autonomia ao time para encontrar a melhor solução para o objetivo.

### 5.3. Lidando com "Feature Creep" (Aumento de Escopo)
O desejo por "só mais uma coisinha" é natural. Saiba como gerenciá-lo.

- **Pergunte "Por quê?":** Qual problema do usuário essa nova ideia resolve? Como ela se conecta com nosso objetivo atual?
- **Use o "Estacionamento de Ideias" (Parking Lot):** Crie um lugar para anotar boas ideias que não são prioridade agora. Isso mostra que a ideia foi ouvida, mas mantém o foco.
- **Argumente com Dados:** "Entendo a ideia, mas nossos dados mostram que 90% dos usuários estão com dificuldade no fluxo X. Proponho mantermos o foco nisso por enquanto."
