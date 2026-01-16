# User Story: US-014-Create-New-Client - Create a New Client Directly

**As a** manager
**I want to** be able to directly add a new client to the CRM
**So that I can** manage clients who did not originate from the lead generation process (e.g., referrals, long-standing relationships).

## Acceptance Criteria

*   **Given** I am logged into the CRM
*   **When** I navigate to the "Clients" section
*   **And** click on a "Add New Client" button
*   **Then** I should be presented with a form to enter client details.

*   **Given** I am on the "Add New Client" form
*   **When** I enter valid information for all required fields (e.g., Name, Contact Information)
*   **And** I submit the form
*   **Then** a new client record should be created and visible in the client list.
*   **And** I should receive a confirmation message.

*   **Given** I am on the "Add New Client" form
*   **When** I attempt to submit the form with missing or invalid required fields
*   **Then** the system should display clear validation errors for each invalid field.
*   **And** prevent the creation of the client until errors are corrected.

*   **Given** a client is created directly
*   **Then** their `contact_classification` should be automatically set to "Client".

## Technical Notes

*   Design a user-friendly form similar to lead creation but tailored for client-specific information.
*   Implement backend validation for all client fields.
*   Ensure the client is associated with the correct agency based on the logged-in user's context.
*   Consider fields for: Name, Email, Phone, Address, Client Type, any relevant notes or preferences.
