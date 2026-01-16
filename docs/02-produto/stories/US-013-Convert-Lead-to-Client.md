# User Story: US-013-Convert-Lead-to-Client - Convert Qualified Lead to Client

**As a** broker or manager
**I want to** easily convert a qualified lead into a client record
**So that I can** accurately track their progression in the sales funnel and manage them as a client.

## Acceptance Criteria

*   **Given** I am viewing the details of a lead with a "qualified" status (or similar)
*   **When** I have the permission to convert leads (e.g., manager or authorized broker)
*   **And** I initiate the "Convert to Client" action
*   **Then** the system should prompt me for any additional client-specific information not captured during the lead phase.

*   **Given** I have provided any necessary additional information (if prompted)
*   **When** I confirm the conversion
*   **Then** a new client record should be created, retaining all relevant information from the lead.
*   **And** the original lead record's status/classification should be updated (e.g., to "Converted" or "Client").
*   **And** the new client record should be visible in the client list.
*   **And** I should receive a confirmation message.

*   **Given** a lead is converted to a client
*   **Then** all associated historical data (e.g., notes, WhatsApp messages) should be linked to the new client record.

## Technical Notes

*   Implement a clear workflow for lead conversion, potentially with a guided form for additional client data.
*   Ensure data transfer from lead to client record is seamless and accurate.
*   Update the lead's `contact_classification` to "Client" as per `update_leads_classification.sql`.
*   Maintain the historical link between the original lead and the new client record for audit trails.
*   Implement authorization checks for the "Convert to Client" action.
