# User Story: US-017-Archive-Client - Archive Client Record

**As a** manager
**I want to** be able to archive client records
**So that I can** remove inactive clients from active lists while retaining their historical data for future reference or compliance.

## Acceptance Criteria

*   **Given** I am logged in as a manager
*   **And** I am viewing the details of an active client
*   **When** I initiate the "Archive Client" action
*   **Then** the system should prompt for confirmation before archiving.

*   **Given** I confirm the archiving action
*   **Then** the client's `contact_classification` should be updated to "Archived".
*   **And** the client record should no longer appear in active client lists by default.
*   **And** the client's historical data (e.g., notes, interactions) should be retained and accessible through a separate "Archived Clients" view.
*   **And** I should receive a confirmation message.

*   **Given** I am viewing the "Archived Clients" list
*   **When** I select an archived client
*   **Then** I should be able to view their details but not perform active management actions unless unarchived.

*   **Given** I am viewing the details of an archived client
*   **When** I initiate an "Unarchive Client" action (with appropriate permissions)
*   **Then** the client's `contact_classification` should revert to "Client".
*   **And** the client should reappear in active client lists.

## Technical Notes

*   Implement a clear UI for archiving/unarchiving, potentially with confirmation dialogues.
*   Update the `contact_classification` field as defined in `update_leads_classification.sql`.
*   Ensure that archived clients are excluded from default queries and lists but remain accessible for historical review.
*   Implement authorization checks (RBAC) for archiving and unarchiving actions.
*   Consider implications for data retention policies and GDPR/LGPD compliance for archived data.
