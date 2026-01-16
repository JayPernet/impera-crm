# User Story: US-028-Enforce-User-Limits - Enforce Agency User Limits

**As an** Admin (StarIAup)
**I want to** set and enforce a maximum number of users for each agency
**So that I can** align the CRM's usage with the subscription plan the agency has purchased.

## Acceptance Criteria

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I create a new agency or edit an existing one
*   **Then** I can set a "Max Users" limit for that agency.

*   **Given** an agency has reached its "Max Users" limit
*   **When** an Agency Manager attempts to invite or create a new user
*   **Then** the action should be blocked.
*   **And** a clear message should be displayed, informing the manager that they have reached their user limit and need to upgrade their plan or contact support.

*   **Given** an agency is below its "Max Users" limit
*   **When** an Agency Manager invites or creates a new user
*   **Then** the action should be successful.
*   **And** the agency's "Current Users" count should be updated.

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I view the agency list on the Admin dashboard
*   **Then** I can clearly see the "Current Users" vs "Max Users" for each agency.

## Technical Notes

*   Add fields `max_users` and `current_users` to the `agencies` table.
*   Implement a check in the user creation/invitation logic to verify if the agency is at its limit before proceeding.
*   Ensure the `current_users` count is accurately maintained (incremented on user creation/activation, decremented on user deletion/suspension).
*   Provide clear and helpful error messages to guide managers when they hit their limit.
