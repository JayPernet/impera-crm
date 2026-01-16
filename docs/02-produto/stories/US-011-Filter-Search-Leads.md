# User Story: US-011-Filter-Search-Leads - Efficient Lead Filtering and Searching

**As a** broker or manager
**I want to** quickly find specific leads based on various criteria
**So that I can** focus on relevant leads and manage my workflow efficiently.

## Acceptance Criteria

*   **Given** I am on the "Leads" list page
*   **When** I use the search bar
*   **And** enter text (e.g., lead name, email, phone number)
*   **Then** the list of leads should dynamically update to show only leads matching the search query.

*   **Given** I am on the "Leads" list page
*   **When** I use the filter options (e.g., by status, source, assigned broker)
*   **Then** the list of leads should update to show only leads matching the selected filters.

*   **Given** I apply multiple filters and/or a search query
*   **Then** the leads list should display results that satisfy all applied criteria.

*   **Given** I am a broker
*   **When** I apply filters or search
*   **Then** I should only see leads assigned to me (or unassigned, if my role permits) that belong to my agency.

*   **Given** I am a manager
*   **When** I apply filters or search
*   **Then** I should see all leads belonging to my agency that match the criteria.

## Technical Notes

*   Implement efficient search queries that can handle partial matches and multiple fields.
*   Provide intuitive UI controls for filtering (e.g., dropdowns, multi-select, date pickers for future date-based filters).
*   Ensure that search and filter operations respect the user's role and agency affiliation (RBAC and multi-tenancy).
*   Consider backend indexing for frequently searched/filtered fields to optimize performance.
