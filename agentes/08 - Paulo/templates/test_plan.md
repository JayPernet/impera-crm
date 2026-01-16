# Test Plan - [Feature Name]

## 1. Scope
**In Scope:** [What are we testing?]
**Out of Scope:** [What are we IGNORING?]

## 2. Risk Assessment
- **Criticality:** [High/Medium/Low]
- **Key Risks:**
  - [Risk 1]
  - [Risk 2]

## 3. Test Cases

| ID | Title | Pre-conditions | Steps | Expected Result | Status |
|----|-------|----------------|-------|-----------------|--------|
| TC-001 | Valid Login | User exists | 1. Enter valid email/pass<br>2. Click Login | Redirect to Dashboard | - |
| TC-002 | Invalid Pass | User exists | 1. Enter wrong pass<br>2. Click Login | Show Error "Invalid credentials" | - |
| TC-003 | Empty Fields | - | 1. Leave fields empty<br>2. Click Login | Disable button OR Show req error | - |

## 4. Environment
- **Browser:** [Chrome/Firefox]
- **Device:** [Desktop/Mobile]
