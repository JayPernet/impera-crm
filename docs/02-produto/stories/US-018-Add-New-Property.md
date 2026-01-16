# User Story: US-018-Add-New-Property - Add a New Property Listing

**As a** broker or manager
**I want to** easily add a new property listing to the CRM
**So that I can** track and manage my available properties.

## Acceptance Criteria

*   **Given** I am logged into the CRM
*   **When** I navigate to the "Properties" section
*   **And** click on an "Add New Property" button
*   **Then** I should be presented with a form to enter property details.

*   **Given** I am on the "Add New Property" form
*   **When** I enter valid information for all required fields (e.g., Address, Type, Price, Number of Bedrooms/Bathrooms)
*   **And** I submit the form
*   **Then** a new property record should be created and visible in the properties list.
*   **And** I should receive a confirmation message.

*   **Given** I am on the "Add New Property" form
*   **When** I attempt to submit the form with missing or invalid required fields
*   **Then** the system should display clear validation errors for each invalid field.
*   **And** prevent the creation of the property until errors are corrected.

*   **Given** a property is created
*   **Then** it should automatically be associated with the agency of the user who created it.

## Technical Notes

*   Design a user-friendly form with clear labels and appropriate input types (e.g., text, number, dropdowns for types).
*   Implement backend validation for all property fields to ensure data integrity.
*   Consider fields for: Address, City, State/Province, Zip/Postal Code, Country, Property Type (House, Apartment, Land, Commercial), Listing Price, Number of Bedrooms, Number of Bathrooms, Area (sq ft/m2), Year Built, Description, Status (Available, Under Offer, Sold).
*   Integrate with the multi-tenancy model to ensure properties are associated with the correct agency.
