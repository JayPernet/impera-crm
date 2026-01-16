# Best Practices - Database & Architecture

## Naming Conventions
- **Tables:** `snake_case`, plural (e.g., `users`, `order_items`).
- **Columns:** `snake_case` (e.g., `first_name`, `created_at`).
- **Foreign Keys:** `[singular_table_name]_id` (e.g., `user_id`).
- **Indexes:** `idx_[table]_[column]` (e.g., `idx_users_email`).

## Security (RLS)
- **Deny by Default:** Enable RLS on all tables immediately.
- **Service Role:** Only use `service_role` key for administrative backend tasks, never on the client.
- **Policies:** Be explicit. Create separate policies for SELECT, INSERT, UPDATE, DELETE if logic differs.

## Performance
- **Indexes:** Index all Foreign Keys. Index columns used frequently in `WHERE` and `ORDER BY`.
- **Data Types:** Use `uuid` for PKs to avoid enumeration attacks. Use `timestamptz` for dates.

## Architecture
- **Stateless:** Prefer stateless backend functions (Edge Functions) where possible.
- **DRY:** Don't Repeat Yourself, but prefer duplication over wrong abstraction.
