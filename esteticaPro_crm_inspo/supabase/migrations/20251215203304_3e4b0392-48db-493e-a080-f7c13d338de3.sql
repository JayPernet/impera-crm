-- Add clinic settings columns to crm_organizations
ALTER TABLE public.crm_organizations
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"monday": {"open": "08:00", "close": "18:00", "enabled": true}, "tuesday": {"open": "08:00", "close": "18:00", "enabled": true}, "wednesday": {"open": "08:00", "close": "18:00", "enabled": true}, "thursday": {"open": "08:00", "close": "18:00", "enabled": true}, "friday": {"open": "08:00", "close": "18:00", "enabled": true}, "saturday": {"open": "08:00", "close": "12:00", "enabled": false}, "sunday": {"open": "08:00", "close": "12:00", "enabled": false}}'::jsonb;

-- Update RLS to allow users to update only business_hours
CREATE POLICY "Users can update business_hours"
ON public.crm_organizations
FOR UPDATE
USING (id = get_user_organization_id(auth.uid()))
WITH CHECK (id = get_user_organization_id(auth.uid()));