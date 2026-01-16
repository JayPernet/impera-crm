# Testing Heuristics

## 1. Boundary Value Analysis (BVA)
Bugs hide at the edges. If a field accepts 1-100 characters:
- Test 0 (Empty)
- Test 1 (Min)
- Test 100 (Max)
- Test 101 (Max + 1)
- Test " " (Whitespace)

## 2. Equivalence Partitioning
Group inputs that should behave similarly.
- Valid emails: `test@test.com`
- Invalid emails: `test`, `test@`, `test.com`

## 3. CRUD-L Check
For every entity, test:
- **C**reate
- **R**ead (List & Detail)
- **U**pdate
- **D**elete
- **L**ist (Pagination/Filter)

## 4. The "Monkey" Test
What happens if I click the button 10 times rapidly? (Debounce check)
What happens if I disconnect Wi-Fi mid-save?
