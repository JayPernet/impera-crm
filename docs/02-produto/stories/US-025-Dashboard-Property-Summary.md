# User Story: US-025-Dashboard-Property-Summary - Dashboard Property Summary

**As a** broker or manager
**I want to** see a summary of available properties on my dashboard
**So that I can** quickly understand the current inventory and identify properties for leads/clients.

## Acceptance Criteria

*   **Given** I am logged in as a Broker
*   **When** I view my dashboard
*   **Then** I should see a widget displaying:
    *   The total number of active properties I am managing.
    *   The number of properties recently added by me (e.g., in the last 7 days).

*   **Given** I am logged in as a Manager
*   **When** I view my dashboard
*   **Then** I should see a widget displaying:
    *   The total number of active properties for the entire agency.
    *   A breakdown of properties by status (e.g., Available, Under Offer).
    *   The number of properties recently added to the agency (e.g., in the last 7 days).

*   **Given** I am a manager or broker
*   **When** I click on a number or section in the property summary widget
*   **Then** I should be redirected to the relevant, pre-filtered property list.

## Technical Notes

*   Create a reusable dashboard widget component for displaying property summaries.
*   Implement efficient backend queries to calculate these numbers, ensuring they respect the user's role and agency.
*   The queries for a manager will need to aggregate data for all properties in their agency.
*   The queries for a broker will need to filter data for only their managed properties.
*   Make the widget interactive, with links to the main property pages.
