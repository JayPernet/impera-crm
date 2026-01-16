# User Story: US-032-Link-WhatsApp-to-Lead-Client - Auto-associate WhatsApp Contacts

**As a** CRM user (broker or manager)
**I want to** have incoming WhatsApp messages from unrecognized numbers automatically suggest linking to existing leads/clients, or create new ones
**So that I can** easily organize communication and ensure all interactions are tracked.

## Acceptance Criteria

*   **Given** an incoming WhatsApp message is received from a number not yet associated with any lead or client
*   **When** I view the message (e.g., in an "Unassigned Chats" inbox)
*   **Then** the system should attempt to find existing leads or clients with a matching phone number and suggest them for association.

*   **Given** a suggested lead/client is presented
*   **When** I confirm the association
*   **Then** the WhatsApp number should be linked to that lead/client.
*   **And** all future and past (if available) messages from that number should appear in their conversation history.

*   **Given** an incoming WhatsApp message is from an unrecognized number
*   **When** no matching lead/client is found, or I choose to create a new one
*   **Then** I should be able to quickly create a new lead or client record directly from the chat interface, pre-populating the phone number.

*   **Given** a new lead/client is created from an unassigned chat
*   **Then** the WhatsApp number should be automatically linked to this new record.

## Technical Notes

*   Develop a matching algorithm to suggest leads/clients based on phone numbers.
*   Provide a clear UI for confirming associations or creating new records.
*   Ensure that once a number is linked, all associated messages are correctly displayed.
*   Consider a "fuzzy" matching for phone numbers (e.g., handling different country codes or formatting) if necessary.
