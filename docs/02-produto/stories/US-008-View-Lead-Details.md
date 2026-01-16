# User Story: US-008-View-Lead-Details - View Comprehensive Lead Details

**As a** broker or manager
**I want to** view all relevant details of a specific lead
**So that I can** understand their profile, needs, and interaction history.

## Acceptance Criteria

*   **Given** I am logged into the CRM
*   **And** I am on the "Leads" list page
*   **When** I click on a specific lead's name or a "View Details" action
*   **Then** I should be navigated to a dedicated lead detail page.

*   **Given** I am on the lead detail page
*   **Then** I should see all the information associated with that lead, including:
    *   Contact information (Name, Email, Phone, Address).
    *   Lead source and date of creation.
    *   Current lead status/classification.
    *   Assigned broker (if any).
    *   Interaction history (e.g., notes, WhatsApp messages, calls - *future integration*).
    *   Properties of interest (*future integration*).
    *   LTV (Lifetime Value) if available (*future integration*).

*   **Given** I am on the lead detail page
*   **When** the lead has associated WhatsApp messages
*   **Then** I should see a clear section displaying these messages.

*   **Given** I attempt to view details of a lead not assigned to me (as a broker) or not belonging to my agency (as a manager/broker)
*   **Then** I should be denied access.
*   **And** an appropriate message (e.g., "Access Denied") should be displayed.

## Technical Notes

*   Design a clear and comprehensive lead detail page layout.
*   Ensure all data displayed is dynamically loaded and accurate.
*   Implement security checks to prevent unauthorized access to lead details based on RBAC and multi-tenancy rules.
*   Plan for future integration points for interaction history (notes, calls), properties of interest, and LTV.
