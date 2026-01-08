-- Allow authenticated users to read user_roles
-- This is needed for features like QuickRequestModal that need to filter users by role

CREATE POLICY "Authenticated users can read user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);