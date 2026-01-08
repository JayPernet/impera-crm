-- Add missing columns to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS budget NUMERIC,
ADD COLUMN IF NOT EXISTS interest_type TEXT DEFAULT 'compra'; -- compra, aluguel, ambos

-- Ensure RLS policies cover these new columns (implicitly they usually do on the table level, but good to remember)
