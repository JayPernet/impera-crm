# User Story: US-010-Assign-Lead-to-Broker - Assign Lead to a Broker

**As a** manager
**I want to** assign a lead to a specific broker within my agency
**So that I can** distribute work and ensure leads are being actively managed.

## Acceptance Criteria

*   **Given** I am logged in as a manager
*   **And** I am viewing the details of an unassigned lead or a lead assigned to another broker
*   **When** I initiate the "Assign Lead" action (e.g., via a dropdown or button)
*   **Then** I should be presented with a list of active brokers within my agency.

*   **Given** I am presented with the list of brokers
*   **When** I select a broker from the list
*   **And** confirm the assignment
*   **Then** the lead should be successfully assigned to the selected broker.
*   **And** the lead's detail page should reflect the new assignment.
*   **And** the newly assigned broker should gain access to view and manage this lead.

*   **Given** I am logged in as a broker
*   **When** I attempt to assign a lead to myself or another broker
*   **Then** I should be denied access to this action.
*   **And** the "Assign Lead" option should either be hidden or disabled.

*   **Given** a lead is assigned to a broker
*   **Then** only that broker (and managers) should have full access to manage the lead's information.

## Technical Notes

*   Implement a clear UI component for lead assignment (e.g., a dropdown menu with a list of agency brokers).
*   Ensure proper authorization checks (RBAC) to allow only managers to perform lead assignments.
*   Update the lead record in the database with the `broker_id`.
*   Integrate with the multi-tenancy and RBAC systems to ensure brokers only appear from the current agency and that permissions are correctly applied post-assignment.
