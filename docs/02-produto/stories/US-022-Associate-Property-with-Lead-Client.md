# User Story: US-022-Associate-Property-with-Lead-Client - Associate Property with Leads/Clients

**As a** broker or manager
**I want to** link properties to specific leads or clients
**So that I can** track interest, match client needs with available listings, and understand property demand.

## Acceptance Criteria

*   **Given** I am viewing the details of a lead or client
*   **When** I have the necessary permissions
*   **And** I initiate an "Associate Property" action
*   **Then** I should be able to search and select properties from my agency's active listings.

*   **Given** I have selected one or more properties
*   **When** I confirm the association
*   **Then** the selected properties should be linked to the lead/client record.
*   **And** these associated properties should be visible in the lead's/client's detail view.
*   **And** I should receive a confirmation message.

*   **Given** I am viewing a property's details
*   **Then** I should be able to see a list of leads or clients associated with that property.

*   **Given** a property is associated with a lead or client
*   **When** that property's status changes (e.g., "Sold")
*   **Then** the system should, if possible, notify or highlight this change to the associated leads/clients (or their assigned brokers).

## Technical Notes

*   Implement a many-to-many relationship in the database between properties and leads/clients.
*   Provide a user-friendly interface for searching and selecting properties to associate (e.g., a search bar with a multi-select dropdown).
*   Ensure that only properties belonging to the user's agency are available for association.
*   Implement authorization checks for the association action.
*   Consider the implications of this association for future features like personalized recommendations or automated notifications.
