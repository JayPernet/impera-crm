# User Story: US-003-Multi-tenant-Data-Isolation - Secure Multi-tenant Data Isolation

**As a** real estate agency manager or broker
**I want to** be assured that my agency's data (leads, clients, properties) is completely separate and inaccessible to other agencies
**So that I can** trust the CRM with sensitive business information.

## Acceptance Criteria

*   **Given** I am logged in as a user belonging to "Agency A"
*   **When** I access any data within the CRM (leads, clients, properties, chat history)
*   **Then** I should only see data that belongs to "Agency A".
*   **And** I should never be able to view, access, or modify data belonging to "Agency B" or any other agency.

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I manage agencies or view data
*   **Then** I should be able to identify which data belongs to which agency.
*   **And** have the necessary tools to manage and access data across agencies, respecting predefined administrative access policies.

## Technical Notes

*   Implement Row-Level Security (RLS) in the database to enforce data isolation at the lowest possible level.
*   Ensure all database queries and API endpoints automatically filter data based on the user's agency context.
*   Design the data model to clearly associate all agency-specific data with an `agency_id` or similar identifier.
*   Thoroughly test for cross-agency data leakage scenarios.
*   Sofia (CTO & Chief Architect) will provide detailed RLS policies and architectural guidance for this.
