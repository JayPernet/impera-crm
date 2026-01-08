-- Add 'professional' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'professional';

-- Add zAPI_identifier column to crm_organizations (keeping whatsapp_identifier for compatibility)
ALTER TABLE public.crm_organizations 
ADD COLUMN IF NOT EXISTS zapi_identifier text;

-- Add procedure_name column to crm_tags if it doesn't exist
ALTER TABLE public.crm_tags 
ADD COLUMN IF NOT EXISTS procedure_name text;

-- Insert super_admin role for jaypernetdesigner@gmail.com
-- First, we need to get the user's auth.uid from auth.users table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role
FROM auth.users
WHERE email = 'jaypernetdesigner@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create a crm_user entry for the super_admin if it doesn't exist
INSERT INTO public.crm_users (supabase_auth_id, email, name, organization_id, active)
SELECT 
  id, 
  'jaypernetdesigner@gmail.com', 
  'Super Admin',
  NULL,
  true
FROM auth.users
WHERE email = 'jaypernetdesigner@gmail.com'
ON CONFLICT (supabase_auth_id) DO NOTHING;