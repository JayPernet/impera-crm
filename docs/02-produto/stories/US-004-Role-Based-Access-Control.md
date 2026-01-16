# User Story: US-004-Role-Based-Access-Control - Flexible Role-Based Access Control

**As an** Administrator (StarIAup) or a Manager (Agency Owner)
**I want to** define and assign specific roles to users within an agency
**So that I can** control what functionalities and data each user can access.

## Acceptance Criteria

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I create a new agency or manage an existing one
*   **Then** I can assign an "Owner" role to a primary user for that agency.

*   **Given** I am logged in as an Agency Owner (Manager role)
*   **When** I invite or manage users within my agency
*   **Then** I can assign roles such as "Manager" or "Broker" to them.
*   **And** each role should have predefined permissions for accessing features like lead management, client management, property management, and chat.

*   **Given** I am logged in as a user with a specific role (e.g., "Broker")
*   **When** I attempt to access a feature or data outside my assigned permissions
*   **Then** I should be denied access.
*   **And** an appropriate message (e.g., "Access Denied" or disabled UI element) should be displayed.

*   **Given** there are different roles within an agency (e.g., Manager, Broker)
*   **When** a user with the "Broker" role views leads assigned to them
*   **Then** they should be able to view and manage only their assigned leads.

## Technical Notes

*   Define roles (Admin, Manager, Broker) and their associated permissions within the application.
*   Implement permission checks at both the UI and API levels to enforce RBAC.
*   Store user roles efficiently in the database and link them to user accounts and agency IDs.
*   Consider a flexible permission system that allows for future expansion of roles and granular permissions.
*   Integration with Supabase user metadata or a separate profile table for role storage.
