# Briefing: Impera CRM

## 1. Objetivo do Projeto

O objetivo do Impera CRM é resolver o caos e a ineficiência enfrentados por pequenas e médias imobiliárias e corretores independentes. O projeto visa fornecer uma plataforma centralizada para gerenciamento de leads, clientes e imóveis, com integração direta ao WhatsApp, eliminando a necessidade de alternar entre sistemas e consolidando informações críticas de negócios.

## 2. Público-Alvo

- **Usuário-Alvo Primário:** Pequenas e médias imobiliárias e corretores autônomos que atualmente dependem de ferramentas fragmentadas (como o WhatsApp) para gerenciar suas operações.
- **Pain Point:** Esses usuários operam em um ambiente caótico, perdendo tempo e correndo o risco de perder informações valiosas devido à falta de um sistema centralizado.

## 3. Funcionalidades Principais (MVP)

- **Gerenciamento de Leads e Clientes:** Um sistema para rastrear e gerenciar todos os contatos.
- **Gerenciamento de Imóveis:** Um banco de dados para listar e gerenciar as propriedades disponíveis.
- **Dashboard Central:** Uma visão geral do status dos leads, clientes e atividades.
- **Páginas Dedicadas:** Telas específicas para Leads, Clientes, Imóveis e Chat.
- **Integração com WhatsApp:** Conexão nativa para evitar a troca de sistema e centralizar a comunicação.
- **Arquitetura Multi-tenant:** Suporte para múltiplas imobiliárias em uma única instância.
- **Controle de Acesso Baseado em Função:**
    - **Admin (StarIAup):** Controle total sobre a plataforma.
    - **Manager (Dono da Imobiliária/Corretor):** Acesso total aos dados e funcionalidades da sua própria imobiliária.

## 4. Requisitos de UI/UX

A interação principal será através de um dashboard e páginas dedicadas para as funcionalidades principais (Leads, Clientes, Chat, etc.). A experiência do usuário deve ser focada em simplicidade e eficiência, reduzindo a carga cognitiva de gerenciar informações complexas.

## 5. Requisitos Técnicos

- **Plataforma:** Aplicação Web (SaaS).
- **Integrações:**
    - Conexão direta com o WhatsApp.
    - Ponto de integração para um futuro Agente de IA (este agente é uma solução separada, mas o CRM deve estar preparado para a conexão).
- **Segurança:** Sistema multi-tenant com políticas de acesso rigorosas para garantir que os dados de uma imobiliária não sejam acessíveis por outra.

## 6. Perguntas Abertas

- Como o usuário está atualmente "hackeando" uma solução? **Resposta:** Usando o WhatsApp como um CRM improvisado.
- O que o usuário odeia na solução atual? **Resposta:** O caos, a ineficiência e a falta de uma fonte central de verdade.
