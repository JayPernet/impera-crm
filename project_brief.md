# Project Brief - CRM Imobiliário v2.0

**Created by:** Ricardo (PM)
**Date:** 2026-01-06
**Status:** Approved for Tech/Design Phase

---

## Goal
Build a SaaS CRM for Real Estate Agencies with WhatsApp integration and AI-powered lead qualification.

## Business Model
**Type:** SaaS (Software as a Service)
**Target Customer:** Real Estate Agencies (Imobiliárias)
**Revenue Model:** Subscription-based (per agency)

## User Hierarchy & Roles

### 1. Super Admin (System Owner/You)
- **Role:** Master Controller.
- **Responsibilities:**
  - Create and manage Agencies (Imobiliárias).
  - Manage Agent accounts linked to Agencies.
  - Manage CRM Tiers and subscription plans.
  - Global system visibility.

### 2. Admin (Imobiliária Manager)
- **Role:** Agency Principal.
- **Responsibilities:**
  - Add/Manage their own Corretores (Agents).
  - Full CRUD of Properties, Leads, Conversations, and Clients.
  - Full visibility into internal Agency data.

### 3. Corretor (Agent)
- **Role:** Associate (can be a freelancer).
- **Responsibilities:**
  - Access to all Agency data (leads, properties, chats) to facilitate collaboration.
  - Performance-driven access (shared dashboard).

## Key Features & Requirements

### Property Management (PO Mandate)
- **Granular Data:** Detailed tracking of typology (bedrooms, suites, area_privativa, m2), positioning (floor, total floors, units per floor), and visibility toggles (hide/show address, price, neighborhood).
- **Lançamentos:** Parent-child relationship support.
- **Visual Flags:** Support for "Tarjas" (Labels) with custom color and text.

### WhatsApp & Automation
- **External Orchestration:** Handled via **N8N** (CRM provides data/webhooks).
- **UI:** Legal-safe naming (use "API Não Oficial" instead of Z-API).
- **Connector Config:** Fields for Token ID and Instance ID for non-official connection.

### UI/UX Priority
- **Goal:** CRM Internal Dashboard first. Landing Page (acquisition) second.

## Success Metrics
- Lead response time < 5 minutes
- Conversion rate improvement (baseline TBD)
- User adoption rate within agencies

## Constraints
- Must use Supabase + Drizzle (per tech stack mandate)
- Must implement strict RLS for multi-tenancy
- Must support WhatsApp API integration
