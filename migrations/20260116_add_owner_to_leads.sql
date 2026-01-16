-- Migration: Add owner_id to leads table for broker assignment
-- Date: 2026-01-16
-- Description: Adds owner_id column to support lead assignment to specific brokers/users

-- Add owner_id column
ALTER TABLE leads
ADD COLUMN owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX idx_leads_owner_id ON leads(owner_id);

-- Update existing leads to assign to the first user in their organization (optional)
-- This ensures historical data has an owner
UPDATE leads
SET owner_id = (
    SELECT id 
    FROM profiles 
    WHERE profiles.organization_id = leads.organization_id 
    LIMIT 1
)
WHERE owner_id IS NULL;

-- Add comment
COMMENT ON COLUMN leads.owner_id IS 'User (broker) responsible for this lead. NULL means unassigned.';
