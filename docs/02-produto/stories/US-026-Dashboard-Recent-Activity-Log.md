# User Story: US-026-Dashboard-Recent-Activity-Log - Dashboard Recent Activity Log

**As a** broker or manager
**I want to** see a log of recent activities related to my leads, clients, and properties on my dashboard
**So that I can** quickly catch up on important updates and follow-ups.

## Acceptance Criteria

*   **Given** I am logged in as a Broker
*   **When** I view my dashboard
*   **Then** I should see a widget displaying a chronological list of recent activities relevant to my assigned leads, clients, and properties.
    *   Examples: "Lead John Doe's status changed to Contacted," "New WhatsApp message from Client Jane Smith," "Property 123 Main St. updated."

*   **Given** I am logged in as a Manager
*   **When** I view my dashboard
*   **Then** I should see a widget displaying a chronological list of recent activities across the entire agency.
    *   Examples: "Broker Alice updated Lead Peter Jones," "New Client added by Broker Bob," "Property 456 Oak Ave. archived."

*   **Given** an activity is displayed in the log
*   **When** I click on an activity item
*   **Then** I should be navigated to the relevant lead, client, or property detail page associated with that activity.

## Technical Notes

*   Implement an activity logging mechanism that records significant events (e.g., create, update, status change for leads, clients, properties; WhatsApp messages).
*   Create a reusable dashboard widget component for displaying the activity log.
*   Ensure the activity log respects RBAC and multi-tenancy rules, showing only activities relevant to the logged-in user and their agency.
*   The log should be ordered by recency.
*   Consider pagination or "load more" functionality for a long activity history.
