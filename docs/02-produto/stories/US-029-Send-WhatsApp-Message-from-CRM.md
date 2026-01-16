# User Story: US-029-Send-WhatsApp-Message-from-CRM - Send a WhatsApp Message from the CRM

**As a** broker or manager
**I want to** send a WhatsApp message to a lead or client directly from their profile in the CRM
**So that I can** communicate with them efficiently without leaving the application.

## Acceptance Criteria

*   **Given** I am viewing the details of a lead or client with a valid WhatsApp number
*   **When** I initiate the "Send WhatsApp Message" action
*   **Then** a message composition interface should appear.

*   **Given** I am using the message composition interface
*   **When** I type a message
*   **And** click "Send"
*   **Then** the message should be sent to the lead's/client's WhatsApp number.
*   **And** the sent message should immediately appear in the conversation history for that lead/client within the CRM.

*   **Given** I attempt to send a message to a lead/client without a valid WhatsApp number
*   **Then** the "Send WhatsApp Message" action should be disabled or an informative message should be displayed.

## Technical Notes

*   Integrate with a WhatsApp Business API provider to handle message sending.
*   Securely store and manage API keys and credentials for the WhatsApp integration.
*   Implement a user-friendly chat interface for message composition.
*   Ensure outgoing messages are logged and associated with the correct lead/client record.
*   Handle potential errors from the WhatsApp API (e.g., number not on WhatsApp, message failed to send) and provide feedback to the user.
