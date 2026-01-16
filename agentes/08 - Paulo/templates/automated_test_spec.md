# Automated Test Spec: [FEATURE NAME]

**Target Story:** User Story [US-XXX]
**Browser Engine:** Chromium (Primary)
**Timeout:** 30s standard

## 1. Test Metadata
- **Feature:** [Feature Name, e.g., Login Flow]
- **Criticality:** [High/Medium/Low]
- **Pre-requisites:**
  - [e.g., User must exist in DB]
  - [e.g., Server running on localhost:3000]

## 2. Scenario Mapping

### Scenario A: [Happy Path Name]
**Criteria Source:** [US-XXX - Scenario 1]

| Story Step (Dado/Quando/Então) | Browser Action (Playwright Logic) | Expected Visual State |
|--------------------------------|-----------------------------------|-----------------------|
| Dado que [estado inicial] | `page.goto(url)` | Page loads, no errors |
| Quando [ação] | `click(selector)` | Element interactive |
| E [ação secundária] | `fill(input, value)` | Typed value appears |
| Então [resultado] | `expect(locator).toBeVisible()` | Success toast shows |

### Scenario B: [Edge Case Name]
**Criteria Source:** [US-XXX - Scenario 2]

| Story Step | Browser Action | Expected Visual State |
|------------|----------------|-----------------------|
| Dado que... | ... | ... |
| Quando... | ... | ... |
| Então... | ... | ... |

## 3. Data Requirements
- **Fixtures needed:**
  - User: `{ email: 'test@example.com', role: 'admin' }`
  - Item: `{ id: 123, status: 'pending' }`

## 4. Execution Log (Simulation)

```typescript
// Copy this block to run the test
test('Scenario A', async ({ page }) => {
  // 1. Setup
  await page.goto('/target-url');
  
  // 2. Action
  // ... code here ...
  
  // 3. Assertion
  // ... code here ...
});
```

## 5. Evidence Checklist
- [ ] Screenshot of initial state
- [ ] Screenshot of final state
- [ ] Console logs captured?
- [ ] Network requests (especially mutations) captured?
