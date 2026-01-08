-- SQL Update to distinguish Leads (Opportunities) from Clients (Portfolio)
-- We are adding a 'classification' column to the leads table.

-- Create the type if it doesn't exist (handling potential re-runs)
DO $$ BEGIN
    CREATE TYPE contact_classification AS ENUM ('lead', 'cliente', 'arquivado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS classification contact_classification DEFAULT 'lead',
ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ, -- Date when they became a client
ADD COLUMN IF NOT EXISTS ltv NUMERIC DEFAULT 0; -- Lifetime Value (soma das vendas)

-- Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_leads_classification ON leads(classification);
