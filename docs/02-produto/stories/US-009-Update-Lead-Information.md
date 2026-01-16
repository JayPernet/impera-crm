# User Story: US-009-Update-Lead-Information - Update Existing Lead Information

**As a** broker or manager
**I want to** modify the details of an existing lead
**So that I can** keep their information accurate and up-to-date.

## Acceptance Criteria

*   **Given** I am viewing the details of a lead
*   **When** I click on an "Edit" button or icon
*   **Then** the lead details should become editable (e.g., a form appears or fields become active).

*   **Given** I am editing a lead's information
*   **When** I modify one or more fields (e.g., phone number, email, notes)
*   **And** I save the changes
*   **Then** the lead's information in the CRM should be updated.
*   **And** I should receive a confirmation message.

*   **Given** I am editing a lead's information
*   **When** I attempt to save changes with invalid data (e.g., malformed email, empty required field)
*   **Then** the system should display clear validation errors.
*   **And** prevent the update until errors are corrected.

*   **Given** I do not have permission to edit a specific lead (e.g., it's not assigned to me, or I lack the role permissions)
*   **When** I attempt to edit that lead
*   **Then** I should be denied access.
*   **And** the "Edit" option should either be hidden or disabled.

## Technical Notes

*   Ensure proper authorization checks (RBAC) before allowing a user to edit a lead.
*   Implement robust backend validation for all editable fields.
*   Provide a user-friendly interface for editing, potentially an inline edit or a dedicated edit form.
*   Consider tracking changes or an audit log for significant lead modifications.
