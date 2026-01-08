-- Add created_by column to crm_tasks for tracking who created the task
ALTER TABLE public.crm_tasks ADD COLUMN created_by UUID REFERENCES public.crm_users(id);

-- Add index for better query performance
CREATE INDEX idx_crm_tasks_created_by ON public.crm_tasks(created_by);