# Browser Testing Patterns (Playwright Style)

This guide defines how Paulo executes automated browser tests to validate User Stories.

## 1. Interaction Philosophy

We act like a REAL user. We do not use hidden inputs or internal state.
- **Locators:** Use user-visible locators (`text=Login`, `label=Username`, `role=button`).
- **Input:** Type character by character (simulation), not copy-paste.
- **Wait:** Wait for UI stability, not arbitrary timeouts (`sleep(5000)` is FORBIDDEN).

## 2. Locator Strategy (Priority Order)

1. **Role & Name (Accessibility):**
   ```ts
   page.getByRole('button', { name: 'Submit' })
   page.getByRole('heading', { name: 'Dashboard' })
   ```
2. **Label (Forms):**
   ```ts
   page.getByLabel('Email Address')
   ```
3. **Placeholder:**
   ```ts
   page.getByPlaceholder('Enter your password')
   ```
4. **Text Content:**
   ```ts
   page.getByText('Welcome back, User')
   ```
5. **Test ID (Last Resort):**
   ```ts
   page.getByTestId('user-menu-trigger')
   ```

## 3. Resilience Patterns

### Auto-Retrying Assertions
Never verify logic immediately after an action. Allow for async updates.
**BAD:**
```ts
click(button)
if (text !== 'Success') fail()
```
**GOOD:**
```ts
await page.getByText('Success').waitFor({ state: 'visible' })
await expect(page.getByText('Success')).toBeVisible()
```

### Dynamic Waiting
Wait for the *effect* of an action, not time.
- After login -> Wait for URL change or Dashboard element.
- After delete -> Wait for item to disappear from list.
- After modal -> Wait for 'dialog' role to be visible.

## 4. Evidence Capture

Every test session MUST capture:
1. **Console Logs:** Hook into `console.log` and `console.error`.
2. **Network Failures:** Capture 4xx/5xx responses.
3. **Screenshots:**
   - On Start
   - On Critical Action (e.g., Submit)
   - On Failure (mandatory)

## 5. Common Scenarios

### Authentication
```ts
await page.goto('/login');
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password').fill('password123');
await page.getByRole('button', { name: 'Sign In' }).click();
await expect(page).toHaveURL('/dashboard');
```

### Form Submission
```ts
await page.getByRole('button', { name: 'New Item' }).click();
await page.getByLabel('Title').fill('My Test Item');
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('My Test Item')).toBeVisible();
```

### Data Grid / Table
```ts
// Check specific row
const row = page.getByRole('row').filter({ hasText: 'My Item' });
await expect(row.getByRole('cell', { name: 'Active' })).toBeVisible();
```

---

*Verified patterns for Vibe Code QA Auto.*
