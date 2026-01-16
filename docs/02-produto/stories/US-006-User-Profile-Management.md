# User Story: US-006-User-Profile-Management - User's Own Profile Management

**As a** registered user (Manager or Broker)
**I want to** view and update my personal profile information
**So that I can** keep my contact details and preferences accurate.

## Acceptance Criteria

*   **Given** I am logged in to the CRM
*   **When** I navigate to my profile settings page
*   **Then** I should see my current profile information (e.g., name, email, phone number).

*   **Given** I am viewing my profile settings
*   **When** I modify my editable profile information (e.g., phone number)
*   **And** I save the changes
*   **Then** my profile information should be updated successfully.
*   **And** I should receive a confirmation message.

*   **Given** I am viewing my profile settings
*   **When** I attempt to change sensitive information like my email address
*   **Then** the system should require additional verification (e.g., current password, email confirmation).

*   **Given** I am viewing my profile settings
*   **When** I attempt to update my profile with invalid data (e.g., malformed email address, empty required field)
*   **Then** the system should display an error message.
*   **And** prevent the invalid update.

## Technical Notes

*   Provide an intuitive UI for users to manage their profiles.
*   Utilize Supabase user management features for updating user metadata.
*   Implement input validation for all editable fields.
*   Consider requiring re-authentication or email confirmation for critical changes like email address.
