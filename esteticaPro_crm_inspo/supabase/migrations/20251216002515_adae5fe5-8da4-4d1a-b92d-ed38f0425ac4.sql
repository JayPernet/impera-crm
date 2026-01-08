-- 1. Drop the limited SELECT-only policy for admins on tasks
DROP POLICY IF EXISTS "Admins can view org tasks" ON crm_tasks;

-- 2. Create a new policy allowing Admin to manage ALL tasks in their organization
CREATE POLICY "Admins can manage org tasks"
ON crm_tasks
FOR ALL
USING (
  (organization_id = get_user_organization_id(auth.uid())) 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Add deleted_at column for soft delete functionality
ALTER TABLE crm_tasks ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;

-- 4. Update existing policies to exclude soft-deleted tasks
-- First drop and recreate the user policy to filter deleted tasks
DROP POLICY IF EXISTS "Users can manage own tasks" ON crm_tasks;
CREATE POLICY "Users can manage own tasks"
ON crm_tasks
FOR ALL
USING (
  (user_id IN (SELECT crm_users.id FROM crm_users WHERE crm_users.supabase_auth_id = auth.uid()))
  AND deleted_at IS NULL
);

-- Recreate admin policy with soft delete filter
DROP POLICY IF EXISTS "Admins can manage org tasks" ON crm_tasks;
CREATE POLICY "Admins can manage org tasks"
ON crm_tasks
FOR ALL
USING (
  (organization_id = get_user_organization_id(auth.uid())) 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND deleted_at IS NULL
);

-- Super admin already has full access but add soft delete filter
DROP POLICY IF EXISTS "Super admins full access tasks" ON crm_tasks;
CREATE POLICY "Super admins full access tasks"
ON crm_tasks
FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  AND deleted_at IS NULL
);