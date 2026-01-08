-- Drop existing policies on crm_procedures
DROP POLICY IF EXISTS "Org users access own procedures" ON public.crm_procedures;
DROP POLICY IF EXISTS "Super admins full access procedures" ON public.crm_procedures;

-- Recreate policies allowing user, admin, and super_admin to manage procedures
CREATE POLICY "Org users full access procedures"
ON public.crm_procedures
FOR ALL
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access procedures"
ON public.crm_procedures
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));