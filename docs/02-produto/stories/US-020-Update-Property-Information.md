# User Story: US-020-Update-Property-Information - Update Existing Property Information

**As a** broker or manager
**I want to** modify the details of an existing property listing
**So that I can** keep its information accurate and up-to-date with changes in price, status, or description.

## Acceptance Criteria

*   **Given** I am viewing the details of a property
*   **When** I click on an "Edit" button or icon
*   **Then** the property details should become editable (e.g., a form appears or fields become active).

*   **Given** I am editing a property's information
*   **When** I modify one or more fields (e.g., price, status, description)
*   **And** I save the changes
*   **Then** the property's information in the CRM should be updated.
*   **And** I should receive a confirmation message.

*   **Given** I am editing a property's information
*   **When** I attempt to save changes with invalid data (e.g., non-numeric price, empty required field)
*   **Then** the system should display clear validation errors.
*   **And** prevent the update until errors are corrected.

*   **Given** I do not have permission to edit a specific property (e.g., it does not belong to my agency, or I lack the role permissions)
*   **When** I attempt to edit that property
*   **Then** I should be denied access.
*   **And** the "Edit" option should either be hidden or disabled.

## Technical Notes

*   Ensure proper authorization checks (RBAC) before allowing a user to edit a property.
*   Implement robust backend validation for all editable fields.
*   Provide a user-friendly interface for editing, potentially an inline edit or a dedicated edit form.
*   Consider tracking changes or an audit log for significant property modifications.
