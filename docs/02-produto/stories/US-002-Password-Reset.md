# User Story: US-002-Password-Reset - Password Reset Functionality

**As a** registered user
**I want to** be able to reset my password if I forget it
**So that I can** regain access to my CRM account.

## Acceptance Criteria

*   **Given** I am on the CRM login page
*   **When** I click on "Forgot Password?" link
*   **Then** I should be prompted to enter my registered email address.

*   **Given** I have entered my registered email address on the "Forgot Password" form
*   **When** I submit the form
*   **Then** I should receive a confirmation message indicating that a password reset link has been sent to my email.
*   **And** an email containing a secure, time-limited password reset link should be sent to my registered email address.

*   **Given** I have received a password reset email
*   **When** I click on the password reset link within the valid time frame
*   **Then** I should be directed to a page where I can set a new password.

*   **Given** I am on the new password page
*   **When** I enter a new password that meets the security requirements (e.g., minimum length, complexity)
*   **And** confirm the new password
*   **Then** my password should be updated successfully.
*   **And** I should be prompted to log in with my new password.

*   **Given** I have received a password reset email
*   **When** I click on an expired or invalid password reset link
*   **Then** I should be informed that the link is invalid or expired.
*   **And** I should be prompted to request a new password reset link.

## Technical Notes

*   Utilize Supabase Authentication's password reset functionality.
*   Ensure password reset links are secure, single-use, and time-limited.
*   Implement clear and informative user feedback messages at each step.
*   Consider rate limiting for password reset requests to prevent abuse.
