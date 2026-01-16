# User Story: US-007-Create-New-Lead - Create a New Lead

**As a** broker or manager
**I want to** easily add a new lead to the CRM
**So that I can** begin tracking and managing their interaction.

## Acceptance Criteria

*   **Given** I am logged into the CRM
*   **When** I navigate to the "Leads" section
*   **And** click on a "Add New Lead" button
*   **Then** I should be presented with a form to enter lead details.

*   **Given** I am on the "Add New Lead" form
*   **When** I enter valid information for all required fields (e.g., Name, Contact Information, Source)
*   **And** I submit the form
*   **Then** a new lead record should be created and visible in the leads list.
*   **And** I should receive a confirmation message.

*   **Given** I am on the "Add New Lead" form
*   **When** I attempt to submit the form with missing or invalid required fields
*   **Then** the system should display clear validation errors for each invalid field.
*   **And** prevent the creation of the lead until errors are corrected.

*   **Given** a lead is created
*   **Then** it should automatically be assigned a default status (e.g., "New" or "Pending Classification").
*   **And** if applicable, the lead should be assigned to the user who created it, or follow an agency's default assignment rule.

## Technical Notes

*   Design a user-friendly form with clear labels and input types.
*   Implement backend validation for all lead fields to ensure data integrity.
*   Consider fields for: Name, Email, Phone, Source (e.g., Website, Referral, Walk-in), Initial Inquiry, Preferred Contact Method.
*   Integrate with the multi-tenancy model to ensure leads are associated with the correct agency.
