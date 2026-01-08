-- Add Z-API credentials columns to crm_organizations
ALTER TABLE public.crm_organizations
ADD COLUMN IF NOT EXISTS token_z_api TEXT,
ADD COLUMN IF NOT EXISTS id_instancia_z_api TEXT;