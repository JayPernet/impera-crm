-- Add disclaimer columns to crm_anamnesis table
ALTER TABLE crm_anamnesis 
ADD COLUMN IF NOT EXISTS disclaimer_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS disclaimer_accepted_at TIMESTAMPTZ;