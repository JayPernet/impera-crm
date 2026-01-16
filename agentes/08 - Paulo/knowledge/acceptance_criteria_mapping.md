# Mapping Acceptance Criteria to Test Scripts

How Paulo translates "Dado/Quando/Então" (Given/When/Then) into executable browser automation.

## The Translation Protocol

### 1. "Dado que" (Given) -> Preconditions
Set up the state **fast** (via API if possible) or via UI navigation.

**Story:**
> "Dado que estou logado como Admin"

**Test Script:**
```ts
// Prefer API login for speed
await apiLogin('admin@example.com');
await page.goto('/dashboard');
```

### 2. "Quando" (When) -> User Action
The primary interaction being tested. Must use **User-Visible Locators**.

**Story:**
> "Quando eu clico em 'Criar Usuário' e preencho o formulário"

**Test Script:**
```ts
await page.getByRole('button', { name: 'Criar Usuário' }).click();
await page.getByLabel('Nome').fill('Novo User');
await page.getByLabel('Email').fill('new@user.com');
await page.getByRole('button', { name: 'Salvar' }).click();
```

### 3. "Então" (Then) -> Assertion
Validation of the result. Must use **Auto-Retrying Assertions**.

**Story:**
> "Então devo ver a mensagem de sucesso e o usuário na lista"

**Test Script:**
```ts
// Toast Check
await expect(page.getByText('Usuário criado com sucesso')).toBeVisible();

// List Check
await expect(page.getByRole('cell', { name: 'new@user.com' })).toBeVisible();
```

## Example: Complex Mapping

### User Story Criteria
**Scenario: Block Organization**
- **Dado** que estou na lista de Organizações
- **Quando** clico em "Bloquear" na Org "Acme Corp"
- **E** confirmo o modal de segurança
- **Então** o status da Org muda para "Bloqueado"
- **E** o botão muda para "Desbloquear"

### Mapped Script
```ts
// Dado
await page.goto('/admin/organizations');

// Quando (Filter row)
const row = page.getByRole('row').filter({ hasText: 'Acme Corp' });
await row.getByRole('button', { name: 'Bloquear' }).click();

// E (Confirm Modal)
await expect(page.getByRole('dialog')).toBeVisible();
await page.getByRole('button', { name: 'Confirmar Bloqueio' }).click();

// Então (State change)
await expect(row.getByText('Bloqueado')).toBeVisible();

// E (UI update)
await expect(row.getByRole('button', { name: 'Desbloquear' })).toBeVisible();
```

## Rules of Engagement

1. **One-to-One Mapping:** Every line in the Acceptance Criteria MUST have a corresponding block in the test script.
2. **Fail Fast:** If "Dado" fails, don't try "Quando".
3. **Clean Up:** Tests should leave the system as they found it (delete created data).

---

*Protocol for converting Ricardo's logical requirements into Paulo's executable truth.*
