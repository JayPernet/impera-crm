# User Story: US-021-Archive-Unarchive-Property - Archive and Unarchive Property Listings

**As a** manager
**I want to** be able to archive property listings that are no longer active (e.g., sold, off-market) and unarchive them if needed
**So that I can** maintain a clean list of active properties while retaining historical data.

## Acceptance Criteria

*   **Given** I am logged in as a manager
*   **And** I am viewing the details of an active property
*   **When** I initiate the "Archive Property" action
*   **Then** the system should prompt for confirmation before archiving.

*   **Given** I confirm the archiving action
*   **Then** the property's status should be updated to "Archived".
*   **And** the property should no longer appear in active property lists by default.
*   **And** the property's data should be retained and accessible through a separate "Archived Properties" view.
*   **And** I should receive a confirmation message.

*   **Given** I am viewing the "Archived Properties" list
*   **When** I select an archived property
*   **Then** I should be able to view its details but not perform active management actions unless unarchived.

*   **Given** I am viewing the details of an archived property
*   **When** I initiate an "Unarchive Property" action (with appropriate permissions)
*   **Then** the property's status should revert to "Available" (or a previously defined active status).
*   **And** the property should reappear in active property lists.

## Technical Notes

*   Implement a clear UI for archiving/unarchiving, potentially with confirmation dialogues.
*   Ensure that archived properties are excluded from default queries and lists but remain accessible for historical review.
*   Implement authorization checks (RBAC) for archiving and unarchiving actions.
*   Consider implications for data retention policies.
