# Guia Para Estruturação de Novos Briefings (Modelo Mestre)

## Objetivo Deste Guia

Este documento serve como um modelo mestre para uma Inteligência Artificial ou um gerente de projetos. O objetivo é usar estas perguntas para extrair as informações essenciais de **qualquer ideia bruta** (seja ela simples ou complexa) e, com base nelas, gerar um briefing detalhado e bem estruturado.

---

### **Fase 1: Interrogatório da Ideia Bruta**

Para qualquer nova ideia apresentada, estas são as perguntas fundamentais que precisam ser respondidas para formar a espinha dorsal do futuro briefing.

#### **1.1. O Coração da Ideia (O Quê e Por Quê?)**
*   **Nome da Ideia:** Qual é o título ou nome provisório do projeto?
*   **Elevator Pitch:** Descreva a ideia em uma única e poderosa frase.
*   **Problema-Raiz:** Qual problema específico no mundo esta ideia resolve? Por que alguém se importaria?
*   **Solução Essencial:** Em sua forma mais simples, o que a ideia faz para resolver esse problema?

#### **1.2. O Foco Humano (Para Quem?)**
*   **Usuário-Alvo Primário:** Quem é a pessoa número um que mais precisa desta solução? Descreva-a. (Ex: "Gerentes de marketing de pequenas empresas", "Estudantes universitários", "Gamers de jogos de estratégia").
*   **Jornada do Usuário:** Qual é o resultado ideal que o usuário alcança ao usar a solução? O que ele ganha com isso? (Ex: "Economiza 5 horas por semana", "Cria um logo profissional em 2 minutos").

#### **1.3. A Forma da Solução (Como?)**
*   **Tipo de Solução:** Qual é a forma principal da solução?
    *   ( ) Aplicação Web (SaaS, Ferramenta Online)
    *   ( ) Agente de IA (Chatbot, Assistente)
    *   ( ) Automação de Processos (Workflow)
    *   ( ) App Mobile
    *   ( ) Outro (especifique):
*   **Interação Principal:** Como o usuário irá interagir com a solução? (Ex: "Preenchendo um formulário", "Conversando com um chat", "Arrastando e soltando elementos em uma tela").
*   **Referências:** Existem projetos ou produtos similares que sirvam de inspiração ou referência? (Links são bem-vindos).

---

### **Fase 2: Geração do Briefing Detalhado (Instruções para a IA)**

Com as respostas da Fase 1 em mãos, utilize as seguintes diretrizes para construir o documento de briefing final.

#### **2.1. Estrutura do Documento**
O briefing gerado deve conter, no mínimo, as seguintes seções:
1.  **Objetivo do Projeto:** Um resumo claro baseado no "Problema-Raiz" e na "Solução Essencial".
2.  **Público-Alvo:** Detalhamento do "Usuário-Alvo".
3.  **Funcionalidades Principais (MVP):** Uma lista das ações essenciais que o usuário deve conseguir realizar.
4.  **Requisitos de UI/UX (se aplicável):** Perguntas sobre identidade visual, experiência do usuário e referências de design.
5.  **Requisitos Técnicos (se aplicável):** Perguntas sobre integrações, tecnologia e infraestrutura.
6.  **Perguntas Abertas:** Questões sobre orçamento, prazo e outras considerações.

#### **2.2. Adaptação Dinâmica**
*   **Complexidade:** Ajuste a profundidade e o número de perguntas do briefing com base no "Tipo de Solução". Um "Agente de IA" terá perguntas diferentes de uma "Aplicação Web".
*   **Tipos de Perguntas:** Varie os tipos de pergunta no briefing gerado (resposta curta, longa, múltipla escolha, seleção única, condicional) para torná-lo mais dinâmico e fácil de responder.
*   **Exemplos:** Sempre que possível, inclua exemplos dentro das perguntas para guiar quem for responder. (Ex: *"...(Por exemplo: Stripe, Google Maps, Slack)..."*).

#### **2.3. Exemplo de Comando Final para a IA**
*"Baseado nas informações coletadas sobre a ideia '[Nome da Ideia]', gere um documento de briefing completo no formato Markdown. O briefing deve ser direcionado para o desenvolvimento de um(a) '[Tipo de Solução]' e deve seguir a estrutura e as diretrizes de adaptação dinâmica deste guia."*

---
### **Anexo: Exemplo de Briefing de Produto (Template)**
*O template abaixo é um exemplo de output gerado com base nas diretrizes deste guia para uma ideia de produto (Tipo A).*

# Product Discovery Briefing

## 1. Core Concept
**Original Idea:**
> [Paste the raw idea summary here]

**Validation Verdict:**
> [Validated / Pivot Needed / Kill]

## 2. The Validation Framework
*(Based on 'Framework de Validação de Ideias')*

### A. The "Gambiarra" (The Hack)
*What hack are users currently doing to solve this?*
> [Answer based on the analysis of the problem. If no hack exists, the problem might not be urgent.]

### B. The "Hate but Tolerate"
*What do users hate about current solutions but tolerate because there's no alternative?*
> [Identify the friction point. E.g., Manual data entry, complex setups, etc.]

### C. The "Manual Customization"
*How are users manually customizing current tools to fit this specific need?*
> [Identify what the user builds on top of existing tools. The product should offer this "out of the box".]

## 3. Value Proposition
**The "Better Because":**
> It is like [Competitor/Tool X], but better because it eliminates [Specific Friction Y].

**Target Audience:**
> [Who suffers from the problems above?]

## 4. Key Features for MVP
*(Focus ONLY on features that solve A, B, and C)*
- [Feature 1]
- [Feature 2]
- [Feature 3]

## 5. Strategic Risks
- [Risk 1]
- [Risk 2]
