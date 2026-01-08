-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.crm_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.crm_users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.crm_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'info', -- info, success, warning
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.crm_notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view own notifications"
ON public.crm_notifications
FOR SELECT
USING (user_id IN (
  SELECT id FROM public.crm_users WHERE supabase_auth_id = auth.uid()
));

CREATE POLICY "Users can update own notifications"
ON public.crm_notifications
FOR UPDATE
USING (user_id IN (
  SELECT id FROM public.crm_users WHERE supabase_auth_id = auth.uid()
));

CREATE POLICY "Super admins full access notifications"
ON public.crm_notifications
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 4. Create function to notify task creator when task is completed
CREATE OR REPLACE FUNCTION public.notify_task_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_completer_name TEXT;
BEGIN
  -- Only trigger if status changed to 'completed' and there's a creator
  IF OLD.status != 'completed' AND NEW.status = 'completed' AND NEW.created_by IS NOT NULL THEN
    -- Get the name of who completed the task (current user)
    SELECT name INTO v_completer_name 
    FROM crm_users 
    WHERE id = NEW.user_id;
    
    -- Don't notify if the creator completed their own task
    IF NEW.created_by != NEW.user_id THEN
      INSERT INTO crm_notifications (
        user_id,
        organization_id,
        title,
        message,
        type,
        link_url
      ) VALUES (
        NEW.created_by,
        NEW.organization_id,
        'Solicitação Atendida',
        COALESCE(v_completer_name, 'A equipe') || ' concluiu sua solicitação: ' || NEW.title,
        'success',
        '/tarefas'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 5. Create trigger on crm_tasks
DROP TRIGGER IF EXISTS trigger_notify_task_completion ON crm_tasks;
CREATE TRIGGER trigger_notify_task_completion
AFTER UPDATE ON crm_tasks
FOR EACH ROW
EXECUTE FUNCTION notify_task_completion();

-- 6. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crm_notifications_user_id ON crm_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_notifications_read ON crm_notifications(user_id, read);