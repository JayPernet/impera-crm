-- Migration: Setup Chat Permissions and Notifications
-- Description: Enable RLS for n8n_historico_mensagens and create notifications table
-- Date: 2026-01-16

-- =====================================================
-- PART 1: Enable RLS for n8n_historico_mensagens
-- =====================================================

-- Enable RLS on the existing table
ALTER TABLE public.n8n_historico_mensagens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view messages from leads in their organization
CREATE POLICY allow_organization_chat_access
ON public.n8n_historico_mensagens
FOR SELECT
USING (
    session_id IN (
        SELECT phone 
        FROM public.leads 
        WHERE organization_id = (
            SELECT organization_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    )
);

-- Policy: Allow users to insert messages for leads in their organization
CREATE POLICY allow_chat_insert
ON public.n8n_historico_mensagens
FOR INSERT
WITH CHECK (
    session_id IN (
        SELECT phone 
        FROM public.leads 
        WHERE organization_id = (
            SELECT organization_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    )
);

-- Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_n8n_messages_session 
ON public.n8n_historico_mensagens(session_id);

CREATE INDEX IF NOT EXISTS idx_n8n_messages_created 
ON public.n8n_historico_mensagens(created_at DESC);

-- =====================================================
-- PART 2: Create notifications table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    message text,
    is_read boolean NOT NULL DEFAULT false,
    entity_type text,
    entity_id uuid
);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY allow_own_notifications_access
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY allow_own_notifications_update
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: System can insert notifications for any user
CREATE POLICY allow_system_notifications_insert
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- =====================================================
-- PART 3: Create trigger to notify on new messages
-- =====================================================

-- Function to create notification when a new message arrives
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
    lead_record RECORD;
    assigned_user_id uuid;
BEGIN
    -- Only notify for incoming messages (type = 'human')
    IF (NEW.message->>'type' = 'human') THEN
        -- Find the lead associated with this session_id (phone)
        SELECT id, owner_id, organization_id, full_name
        INTO lead_record
        FROM public.leads
        WHERE phone = NEW.session_id
        LIMIT 1;

        -- If lead exists and has an assigned owner, create notification
        IF lead_record.owner_id IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                type,
                title,
                message,
                entity_type,
                entity_id
            ) VALUES (
                lead_record.owner_id,
                'new_message',
                'Nova mensagem de ' || lead_record.full_name,
                substring(NEW.message->>'content', 1, 100),
                'lead',
                lead_record.id
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.n8n_historico_mensagens;
CREATE TRIGGER trigger_notify_new_message
    AFTER INSERT ON public.n8n_historico_mensagens
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_message();
