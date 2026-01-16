# User Story: US-031-View-WhatsApp-History - View Centralized WhatsApp Conversation History

**As a** broker or manager
**I want to** see the full conversation history with a lead or client in one place
**So that I can** easily review past interactions and have full context for future communication.

## Acceptance Criteria

*   **Given** I am viewing the details of a lead or client
*   **When** I navigate to their chat or communication history tab
*   **Then** I should see a chronological log of all WhatsApp messages exchanged with that contact through the CRM.

*   **Given** I am viewing the conversation history
*   **Then** messages I sent (outgoing) should be visually distinct from messages I received (incoming).
*   **And** each message should have a timestamp.

*   **Given** I am a manager
*   **When** I view the conversation history of a lead or client assigned to a broker in my agency
*   **Then** I should be able to see the full conversation history.

*   **Given** I am a broker
*   **When** I view a lead or client assigned to another broker
*   **Then** I should be denied access to their conversation history unless my role permits it.

## Technical Notes

*   Design a database schema to store message history, linking each message to a lead/client, user, and agency.
*   Create a clean, readable chat interface to display the conversation log.
*   Ensure the history is loaded efficiently and supports scrolling through long conversations.
*   Implement RBAC to control access to conversation histories, ensuring privacy and proper data scoping.