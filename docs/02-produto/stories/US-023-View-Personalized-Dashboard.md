# User Story: US-023-View-Personalized-Dashboard - View Personalized Dashboard on Login

**As a** registered user (broker, manager, or admin)
**I want to** see a personalized dashboard immediately after logging in
**So that I can** get a quick, relevant overview of my work and priorities.

## Acceptance Criteria

*   **Given** I am a registered user
*   **When** I successfully log in to the CRM
*   **Then** I should be redirected to my main dashboard page.

*   **Given** I am logged in as a Broker
*   **When** I view my dashboard
*   **Then** I should see widgets and summaries relevant to my role, such as "My Assigned Leads," "My Recent Activity," and "My Top Properties."

*   **Given** I am logged in as a Manager
*   **When** I view my dashboard
*   **Then** I should see widgets and summaries relevant to my role, such as "Team Performance," "Agency-wide Lead Status," and "Recent Sales."

*   **Given** I am logged in as an Admin (StarIAup)
*   **When** I view my dashboard
*   **Then** I should see widgets and summaries relevant to my role, such as "Platform-wide User Count," "Agency Status Overview," and "System Health."

## Technical Notes

*   Implement a routing mechanism that directs users to their dashboard upon successful login.
*   The dashboard page should be composed of modular widgets or components.
*   Implement logic to dynamically render different widgets based on the user's role (Broker, Manager, Admin).
*   Ensure all data displayed on the dashboard respects multi-tenancy and RBAC rules (e.g., a manager only sees their agency's data).
