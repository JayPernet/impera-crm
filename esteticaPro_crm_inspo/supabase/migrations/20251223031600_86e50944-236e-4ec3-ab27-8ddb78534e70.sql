-- Update RLS policies for crm_users to allow 'user' role to UPDATE but not DELETE

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view users in same org" ON public.crm_users;
DROP POLICY IF EXISTS "Admins can manage users in same org" ON public.crm_users;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.crm_users;

-- 1. Super admins have full access
CREATE POLICY "Super admins full access crm_users"
ON public.crm_users
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 2. All org users can SELECT users in same organization
CREATE POLICY "Org users can view users in same org"
ON public.crm_users
FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

-- 3. All org users (user, admin, professional) can UPDATE users in same organization
CREATE POLICY "Org users can update users in same org"
ON public.crm_users
FOR UPDATE
USING (organization_id = get_user_organization_id(auth.uid()))
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- 4. Only admins can INSERT new users (creation goes through edge function anyway)
CREATE POLICY "Admins can insert users in same org"
ON public.crm_users
FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid())
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- 5. Only admins can DELETE users in same organization
CREATE POLICY "Admins can delete users in same org"
ON public.crm_users
FOR DELETE
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND has_role(auth.uid(), 'admin'::app_role)
);