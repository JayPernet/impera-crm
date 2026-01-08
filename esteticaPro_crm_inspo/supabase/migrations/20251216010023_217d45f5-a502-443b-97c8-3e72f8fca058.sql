-- Allow professionals to create tasks for users in the same organization
-- This is needed for the QuickRequestModal feature

CREATE POLICY "Professionals can create tasks for same org"
ON public.crm_tasks
FOR INSERT
TO authenticated
WITH CHECK (
  -- User must be a professional
  public.has_role(auth.uid(), 'professional')
  AND
  -- Organization must match the user's organization
  organization_id = public.get_user_organization_id(auth.uid())
);