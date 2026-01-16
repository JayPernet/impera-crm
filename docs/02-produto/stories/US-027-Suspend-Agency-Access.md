# User Story: US-027-Suspend-Agency-Access - Suspend Agency Access

**As an** Admin (StarIAup)
**I want to** temporarily suspend an entire agency's access to the CRM
**So that I can** enforce subscription terms (e.g., non-payment) or handle security issues without deleting their data.

## Acceptance Criteria

*   **Given** I am logged in as an Admin (StarIAup)
*   **And** I am viewing the list of agencies on the Admin dashboard
*   **When** I initiate the "Suspend" action for a specific agency
*   **Then** the system should prompt for confirmation.

*   **Given** I confirm the suspension
*   **Then** the agency's status should be updated to "Suspended".
*   **And** all users from that agency should immediately be blocked from logging in.
*   **And** any active sessions for users from that agency should be invalidated, forcing them to be logged out.
*   **And** the agency's data should remain intact but inaccessible to its users.

*   **Given** an agency's status is "Suspended"
*   **When** I initiate an "Unsuspend" or "Reactivate" action
*   **Then** the agency's status should be updated to "Active".
*   **And** users from that agency should be able to log in again.

## Technical Notes

*   Implement a status field (e.g., `status: 'active' | 'suspended'`) on the `agencies` table.
*   The authentication middleware/logic must check the agency's status before validating a user's credentials or session.
*   Implement a mechanism to forcefully invalidate all active sessions belonging to a suspended agency.
*   Ensure the UI clearly indicates an agency's suspended status in the Admin dashboard.
