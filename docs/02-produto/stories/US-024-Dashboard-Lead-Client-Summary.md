# User Story: US-024-Dashboard-Lead-Client-Summary - Dashboard Lead and Client Summary

**As a** broker or manager
**I want to** see a summary of leads and clients on my dashboard
**So that I can** quickly gauge my sales funnel and client base status.

## Acceptance Criteria

*   **Given** I am logged in as a Broker
*   **When** I view my dashboard
*   **Then** I should see a widget displaying:
    *   The total number of my active leads.
    *   The number of my new leads (e.g., created in the last 7 days).
    *   The total number of my clients.

*   **Given** I am logged in as a Manager
*   **When** I view my dashboard
*   **Then** I should see a widget displaying:
    *   The total number of active leads for the entire agency.
    *   A breakdown of leads by status (e.g., a pie chart or bar graph showing New, Contacted, Qualified).
    *   The total number of clients for the entire agency.

*   **Given** I am a manager or broker
*   **When** I click on a number or section in the summary widget
*   **Then** I should be redirected to the relevant, pre-filtered list (e.g., clicking on "New Leads" takes me to the leads page filtered by "New").

## Technical Notes

*   Create a reusable dashboard widget component for displaying these summaries.
*   Implement efficient backend queries to calculate these numbers, ensuring they respect the user's role and agency.
*   The queries for a manager will need to aggregate data for all users in their agency.
*   The queries for a broker will need to filter data for only their assigned items.
*   Make the widget interactive, with links to the main data pages.
