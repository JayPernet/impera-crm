-- Add created_by column to crm_users table for audit trail
ALTER TABLE public.crm_users 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.crm_users(id);