-- Add CNPJ and Instagram columns to crm_organizations
ALTER TABLE public.crm_organizations
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;