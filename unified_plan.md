# Plano Unificado do Projeto - CRM Imobiliário v2.0

**Orquestrado por:** 08 - Gabriel (Orchestrator)
**Data:** 2026-01-06
**Status:** AGUARDANDO APROVAÇÃO FINAL

---

## 📋 Resumo Executivo

**O que estamos construindo:**
Um CRM SaaS Multi-tenant para Imobiliárias com foco em alta performance, gestão de inventário complexo (Lançamentos e Revenda) e integração profunda com WhatsApp via N8N.

**Por que estamos construindo:**
Para centralizar Leads, Clientes e Imóveis em uma única fonte da verdade, permitindo que a IA (Secretária) e os Corretores trabalhem de forma orquestrada e eficiente.

---

## 🎯 Fundação Estratégica (Ricardo & PO)

**Briefing:** [Project Brief v2.0](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/project_brief.md)
**Mandatos:** [Requirement Log](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/requirements_log.md)

**Principais Definições:**
- **Hierarquia:** Super Admin (Você) -> Admin (Dono da Imob) -> Corretor.
- **Inventário:** Suporte a Empreendimentos e Unidades com dezenas de filtros técnicos.
- **WhatsApp:** Interface de chat integrada (API Oficial e não-oficial).

---

## 🏗️ Arquitetura Técnica (Sofia)

**Blueprints:** [Tech Architecture](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/tech_architecture.md) | [Database Inventory](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/database_inventory.md)

**Destaques:**
- **Stack:** Next.js 16 + Drizzle + Supabase (RLS).
- **Multi-tenancy:** Isolamento total de dados via Row Level Security.
- **N8N integration:** CRM como Data Hub (RAG Ready) e disparador de Webhooks.
- **Follow-up:** Sistema de FUP comercial agendado via `pg_cron` se houver WhatsApp como feature da respectiva imobiliária.

---

## 🎨 Design & Experiência (Amanda & Pamela)

**Specs:** [Design System (JSON)](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/design_system.json) | [Frontend Spec](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/spec_frontend.md) | [Copy Strategy](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/copy_strategy.md)

**Diretrizes Visuais:**
- **Vibe:** "Data as Hero" (Alta densidade, premium, clean).
- **PT-BR:** Interface 100% localizada.
- **Avatar Policy:** Sem avatares para Leads/Clientes (Iniciais em círculos coloridos).
- **Dual Theme:** Dashboard focado em Dark Mode; Chat em Light Mode.

---

## 🚀 Plano de Execução (Helena)

**Roadmap:** [Master PRP List](file:///home/pernet/Documentos/StarIAup/Projetos/CRM Imobiliária/master_prp_list.md)

**Missões Diárias:**
1. **Missão 01:** Setup, Auth Multi-tenant e Sidebar.
2. **Missão 02:** Inventário Pro (Imóveis e Lançamentos).
3. **Missão 03:** Gestão de Leads e Clientes.
4. **Missão 04:** Central de Chat e Hub N8N.
5. **Missão 05:** Dashboard de Analytics e Polimento Final.

---

## ✅ Checklist de Aprovação

Antes de autorizar o código, confirme:
- [ ] A arquitetura de dados (decimal para preços, RLS) atende sua necessidade técnica?
- [ ] O visual "sem avatares" e com alta densidade de dados está de acordo com as referências?
- [ ] O fluxo de chat via N8N preserva suas automações atuais?

---

## 🔄 Próximos Passos (Se Aprovado)

Assim que você der o sinal, o **Gabriel** enviará a **Missão 01** para o **Marcos (Backend)** e **Claudio (Full-stack)** iniciarem o repo.

**Deseja revisar algum artefato específico ou podemos disparar a Missão 01?**
