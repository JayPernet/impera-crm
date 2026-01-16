# User Story: US-001-User-Login - Secure User Login

**As a** registered user
**I want to** securely log in to the CRM
**So that I can** access my agency's data and functionalities.

## Acceptance Criteria

*   **Given** I am on the CRM login page
*   **When** I enter my registered email and password
*   **And** my credentials are valid
*   **Then** I should be redirected to my agency's dashboard.
*   **And** a session should be established, keeping me logged in until I explicitly log out or the session expires.

*   **Given** I am on the CRM login page
*   **When** I enter an unregistered email or an incorrect password
*   **Then** I should receive an error message indicating invalid credentials.
*   **And** I should remain on the login page.

*   **Given** I have an active session
*   **When** I navigate to the login page directly
*   **Then** I should be automatically redirected to my agency's dashboard.

## Technical Notes

*   Utilize Supabase Authentication for login process.
*   Implement secure password hashing and storage.
*   Handle session management (e.g., JWT tokens).
*   Provide clear feedback messages for success and failure.
