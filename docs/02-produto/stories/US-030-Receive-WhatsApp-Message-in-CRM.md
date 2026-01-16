# User Story: US-030-Receive-WhatsApp-Message-in-CRM - Receive WhatsApp Messages in the CRM

**As a** broker or manager
**I want to** receive incoming WhatsApp messages from leads or clients directly within the CRM
**So that I can** centralize communication and respond promptly.

## Acceptance Criteria

*   **Given** a lead or client sends a WhatsApp message to the agency's associated WhatsApp number
*   **When** the message is received by the WhatsApp integration
*   **Then** the message should appear in the CRM, associated with the correct lead or client.
*   **And** the assigned broker should be notified of the new message (e.g., via a badge, notification).

*   **Given** an incoming WhatsApp message is from an unknown number
*   **Then** the message should be flagged as unassigned or associated with a new "unassigned lead" entry for review.

*   **Given** an incoming message is received
*   **When** I view the lead/client profile or a dedicated chat interface
*   **Then** the message should be visible in the conversation history, clearly marked as an incoming message.

## Technical Notes

*   Set up webhooks or polling with the WhatsApp Business API to receive incoming messages.
*   Develop logic to identify the sender and associate the message with an existing lead or client based on their WhatsApp number.
*   Implement a notification system within the CRM for new incoming messages.
*   Handle messages from unknown numbers by creating new leads or directing them to a special inbox for review.
*   Ensure real-time or near real-time delivery of messages to the CRM interface.
