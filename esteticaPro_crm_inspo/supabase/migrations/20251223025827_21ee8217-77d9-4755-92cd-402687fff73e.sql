-- Add preferences column to crm_users table
ALTER TABLE public.crm_users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"theme": "system", "notifications": {"newLeads": true, "taskReminders": true, "dailySummary": false}}'::jsonb;