# Requirement & Assumption Log - CRM Imobiliário

**Project:** CRM Imobiliário v2.1
**Role:** Ricardo (PM)
**Date:** 2026-01-06

## 1. Multi-Tenancy & Roles (CONFIRMED)
- **Hierarchy:** 
    - **Super Admin (User):** Manages Imobiliárias, Corretores, and Tiers.
    - **Admin (Manager):** Manages their Agency's Corretores and full CRUD of data.
    - **Corretor (Agent):** Shared access to the agency's data to facilitate collaboration.
- **Impact (Sofia):** Use RLS with roles `super_admin`, `admin`, and `agent` linked to `organization_id`.

## 2. Property Schema (CONFIRMED - PO LIST)
- **Typology:** Must support integers for bedrooms, suites, bathrooms, parking, floors.
- **Measurements:** Text fields for area_m2, area_privativa, area_construida.
- **Visibility Toggles:** Boolean flags for `mostrar_endereco`, `mostrar_bairro`, `mostrar_preco`, etc.
- **Marketing:** `tarja_texto` and `tarja_cor` for visual labels.
- **Lançamentos:** `condominio_id` as FK to support parent (Development) / child (Unit) hierarchy.

## 3. WhatsApp Strategy (CONFIRMED)
- **Connectors:** Official API (Meta) and Non-Official API (Token/Instance ID).
- **Naming:** NEVER use "Z-API" in the UI. Use "API Não Oficial".
- **Externalization:** Automation is offloaded to N8N via nodes/webhooks. CRM provides the data source.

## 4. UI/UX Focus (CONFIRMED)
- **Priority:** CRM Dashboard/Internal Tools first. External Landing Page for sales second.
- **Standard:** "Invisible Design" (Data as Hero).

## 5. Automation & N8N (CONFIRMED)
- **Method:** CRM provides webhooks and vector data for RAG. N8N handles the chat orchestration.
