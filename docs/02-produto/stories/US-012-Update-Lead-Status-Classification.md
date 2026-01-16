# User Story: US-012-Update-Lead-Status-Classification - Update Lead Status and Classification

**As a** broker or manager
**I want to** update a lead's status and classification (e.g., Lead, Client, Archived)
**So that I can** accurately reflect their position in the sales funnel and manage their lifecycle.

## Acceptance Criteria

*   **Given** I am viewing the details of a lead
*   **When** I have the necessary permissions (e.g., broker can update status, manager can update classification)
*   **Then** I should see an option to modify the lead's status (e.g., "New", "Contacted", "Meeting Scheduled", "Follow-up") and classification (e.g., "Lead", "Client", "Archived").

*   **Given** I am updating a lead's status or classification
*   **When** I select a new status or classification from a predefined list
*   **And** confirm the change
*   **Then** the lead's status/classification should be updated in the CRM.
*   **And** this change should be reflected in the lead's history or activity log.

*   **Given** a lead's classification changes from "Lead" to "Client"
*   **Then** the system should, if applicable, trigger processes for client onboarding (e.g., automatically create a client record, if not already linked).

*   **Given** a lead's classification changes to "Archived"
*   **Then** the lead should no longer appear in active lead lists by default.
*   **And** its data should be retained for historical purposes.

## Technical Notes

*   Implement dropdowns or similar UI elements for selecting predefined statuses and classifications.
*   Ensure the available statuses and classifications are configurable and consistent across the system.
*   Update the `contact_classification` and other relevant fields in the database as per the `update_leads_classification.sql` definitions.
*   Consider cascading effects of status/classification changes (e.g., when a lead becomes a client, its LTV calculation might start).
*   Implement robust validation to prevent invalid state transitions.
*   The `update_leads_classification.sql` file will be a direct reference for the database schema required for this functionality.
