# Master PRD: Guia e Exemplo de Preenchimento

> [!IMPORTANT]
> **ESTE É UM TEMPLATE COM UM EXEMPLO ILUSTRATIVO.**
>
> O conteúdo a seguir foi preenchido com dados do projeto fictício **"NutriPlan"** para demonstrar um PRD bem estruturado.
>
> **INSTRUÇÃO:** Ao usar este template, apague os exemplos e preencha cada seção com as informações do **seu projeto**. A estrutura é o guia; o conteúdo deve ser original.

---

## 1. Visão Geral do Produto *(Substitua os exemplos abaixo)*

**Nome do Projeto:** NutriPlan (*Exemplo: substitua pelo nome do seu projeto*)
**Visão:** Simplificar a jornada para uma vida saudável, oferecendo planos de refeição personalizados e inteligentes que se adaptam às necessidades e metas individuais de cada usuário. (*Exemplo: descreva a visão do seu projeto em uma frase inspiradora*)
**Público-Alvo:** Indivíduos com idade entre 25-45 anos, de ambos os sexos, que buscam melhorar seus hábitos alimentares, seja para perda de peso, ganho de massa muscular ou simplesmente para manter um estilo de vida mais saudável. Inclui pessoas com restrições alimentares (vegetarianos, veganos, intolerantes à lactose/glúten). (*Exemplo: descreva em detalhe para quem é este produto*)

## 2. Objetivos de Negócio e Métricas de Sucesso *(Substitua os exemplos abaixo)*
*O que define o sucesso deste produto?*

- **Objetivo 1 (Exemplo): Aquisição de Usuários**
  - **Métrica:** Atingir 10.000 usuários ativos mensais (MAU) no primeiro semestre após o lançamento.
  - **KPI:** Crescimento percentual de novos usuários por semana.

- **Objetivo 2 (Exemplo): Engajamento e Retenção**
  - **Métrica:** Manter uma taxa de retenção de 40% no primeiro mês (D30).
  - **KPI:** Número de planos de refeição gerados por usuário por semana.

- **Objetivo 3 (Exemplo): Validação do Modelo de Negócio**
  - **Métrica:** Atingir uma taxa de conversão de 3% de usuários gratuitos para o plano Premium.
  - **KPI:** Receita Mensal Recorrente (MRR).

## 3. Definição de Escopo (MoSCoW) *(Substitua os exemplos abaixo)*
*Foco no que é essencial para entregar valor real no MVP.*

**Must Have (Essencial para o MVP):**
- **(Exemplo) EPC-01: Onboarding e Perfil do Usuário:** O usuário deve poder se cadastrar e configurar seu perfil com informações básicas (idade, peso, altura, nível de atividade) e metas (perder peso, etc.).
- **(Exemplo) EPC-02: Geração do Plano de Refeições:** O sistema deve gerar um plano de refeições semanal com base no perfil e nas metas do usuário.
- **(Exemplo) EPC-03: Visualização do Plano:** O usuário deve conseguir ver as refeições diárias (café da manhã, almoço, jantar) com receitas simples e informações nutricionais básicas (calorias, macros).
- **(Exemplo) EPC-04: Lista de Compras:** O sistema deve gerar uma lista de compras consolidada com base no plano de refeições da semana.

**Should Have (Importante, mas não bloqueante para o MVP):**
- **(Exemplo) EPC-05: Substituição de Refeições:** Permitir que o usuário troque uma refeição sugerida por outra opção compatível com sua dieta.
- **(Exemplo) EPC-06: Log de Refeições:** O usuário deve poder marcar as refeições que consumiu.

**Could Have (Desejável, se houver tempo e recursos):**
- *(Exemplo)* Integração com assistentes de voz (Google Assistant, Alexa) para consulta do plano diário.
- *(Exemplo)* Suporte para múltiplos perfis dentro de uma mesma conta (ex: plano familiar).

**Won't Have (Fora do Escopo Inicial):**
- *(Exemplo)* Integração direta com serviços de entrega de supermercado.
- *(Exemplo)* Funcionalidades de rede social para compartilhamento de progresso e receitas.
- *(Exemplo)* Plano de exercícios físicos.

## 4. Mapa de Épicos *(Adapte à realidade do seu projeto)*
*Estrutura de alto nível que quebra o produto em módulos funcionais.*

| ID | Épico (Exemplo) | Descrição Resumida (Exemplo) | Status |
|:---|:---|:---|:---|
| **EPC-01** | Onboarding e Perfil do Usuário | Coleta de dados essenciais para personalização da experiência e criação da conta. | `A Fazer` |
| **EPC-02** | Motor de Geração de Planos | Lógica central do produto, responsável por criar os planos de refeição de forma inteligente. | `A Fazer` |
| **EPC-03** | Visualização do Plano e Receitas | Interface onde o usuário interage com seu plano de refeições diário e semanal. | `A Fazer` |
| **EPC-04** | Gestão da Lista de Compras | Funcionalidade para agregar e organizar os ingredientes necessários para a semana. | `A Fazer` |
| **EPC-05** | Substituição de Refeições | Mecanismo para dar flexibilidade ao usuário, permitindo trocas no cardápio. | `A Fazer` |
| **EPC-06** | Log de Refeições e Acompanhamento | Ferramentas para o usuário registrar seu consumo e monitorar a adesão ao plano. | `A Fazer` |

## 5. Premissas Estratégicas e Riscos *(Substitua os exemplos abaixo)*
*O que estamos assumindo como verdade e o que pode dar errado?*

- **Premissa 1 (Exemplo):** Os usuários estão dispostos a pagar por um serviço que simplifique o planejamento alimentar.
  - **Risco:** O mercado pode estar saturado de soluções gratuitas ou "boas o suficiente", tornando a monetização um desafio.
  - **Mitigação:** Focar em uma experiência de usuário superior e em uma personalização que as ferramentas gratuitas não oferecem.

- **Premissa 2 (Exemplo):** Conseguimos gerar planos de refeição que são nutricionalmente adequados e saborosos.
  - **Risco:** As sugestões podem ser repetitivas, nutricionalmente desbalanceadas ou não agradar ao paladar do usuário.
  - **Mitigação:** Curadoria de uma base de receitas diversificada e valiações com nutricionistas. Implementar um sistema de feedback de receitas.

- **Premissa 3 (Exemplo):** Uma lista de compras automática é um diferencial valorizado pelos usuários.
  - **Risco:** A complexidade de agregar ingredientes de diferentes receitas pode gerar uma lista confusa e pouco prática.
  - **Mitigação:** Desenvolver um algoritmo inteligente para agrupar itens e otimizar a lista para uma experiência de compra eficiente.