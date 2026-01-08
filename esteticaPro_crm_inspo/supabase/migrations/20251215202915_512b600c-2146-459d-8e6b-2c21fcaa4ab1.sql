-- Add new columns to crm_users for professional management
ALTER TABLE public.crm_users
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS working_days TEXT[] DEFAULT '{}';

-- Update RLS policy to allow users to view their own record and users in same org
-- Keep existing policies, just ensure users can see all org users (already exists)

-- Add index for better performance on organization queries
CREATE INDEX IF NOT EXISTS idx_crm_users_organization_id ON public.crm_users(organization_id);