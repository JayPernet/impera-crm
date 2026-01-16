# User Story: US-005-Admin-User-Management - StarIAup Admin Agency Management

**As an** Admin (StarIAup)
**I want to** manage agencies and their users at a high level without accessing their private business data (leads, clients, etc.)
**So that I can** administer the platform, enforce subscription limits, and provide support while respecting client privacy.

## Acceptance Criteria

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I access the Admin dashboard
*   **Then** I should see a list of all registered agencies with key metadata:
    *   Agency Name
    *   Agency Status (e.g., Active, Suspended)
    *   Current number of active users
    *   Maximum allowed users (plan limit)

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I select an agency
*   **Then** I can view a list of users associated with that agency (e.g., name, email, role).
*   **And** I can modify a user's role or suspend/activate their individual account.
*   **But** I should **not** be able to see or access the agency's leads, clients, properties, or chat data.

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** a new agency signs up
*   **Then** I should have a mechanism to create the agency, set its user limit based on their plan, and create the initial owner account.

## Technical Notes

*   Develop a dedicated administrative interface that explicitly scopes data access to platform-level and agency metadata only.
*   The backend must enforce that Admin queries cannot join or retrieve agency-specific business data.
*   Utilize Supabase Admin client for user management.
*   Ensure all administrative actions are logged for auditing purposes.
