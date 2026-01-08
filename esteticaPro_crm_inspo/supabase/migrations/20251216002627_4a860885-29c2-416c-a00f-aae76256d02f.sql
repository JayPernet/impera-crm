-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to permanently delete soft-deleted tasks older than 7 days
CREATE OR REPLACE FUNCTION public.cleanup_deleted_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM crm_tasks 
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL '7 days';
END;
$$;

-- Schedule the cleanup to run daily at 3 AM
SELECT cron.schedule(
  'cleanup-deleted-tasks',
  '0 3 * * *',
  'SELECT public.cleanup_deleted_tasks()'
);