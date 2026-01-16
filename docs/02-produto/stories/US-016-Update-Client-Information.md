# User Story: US-016-Update-Client-Information - Update Existing Client Information

**As a** broker or manager
**I want to** modify the details of an existing client
**So that I can** keep their information accurate and up-to-date for effective relationship management.

## Acceptance Criteria

*   **Given** I am viewing the details of a client
*   **When** I click on an "Edit" button or icon
*   **Then** the client details should become editable (e.g., a form appears or fields become active).

*   **Given** I am editing a client's information
*   **When** I modify one or more fields (e.g., phone number, email, address, notes)
*   **And** I save the changes
*   **Then** the client's information in the CRM should be updated.
*   **And** I should receive a confirmation message.

*   **Given** I am editing a client's information
*   **When** I attempt to save changes with invalid data (e.g., malformed email, empty required field)
*   **Then** the system should display clear validation errors.
*   **And** prevent the update until errors are corrected.

*   **Given** I do not have permission to edit a specific client (e.g., not belonging to my agency, or I lack the role permissions)
*   **When** I attempt to edit that client
*   **Then** I should be denied access.
*   **And** the "Edit" option should either be hidden or disabled.

## Technical Notes

*   Ensure proper authorization checks (RBAC) before allowing a user to edit a client.
*   Implement robust backend validation for all editable fields.
*   Provide a user-friendly interface for editing, potentially an inline edit or a dedicated edit form.
*   Consider tracking changes or an audit log for significant client modifications.
