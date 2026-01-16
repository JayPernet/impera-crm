-- Create activities table for tracking system events
CREATE TABLE IF NOT EXISTS public.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    entity_type text NOT NULL, -- 'lead', 'property', 'client', 'message'
    entity_id uuid NOT NULL,
    action_type text NOT NULL, -- 'create', 'update', 'archive', 'delete', 'status_change', 'message'
    description text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for efficient querying
CREATE INDEX idx_activities_organization_id ON public.activities(organization_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);
CREATE INDEX idx_activities_entity ON public.activities(entity_type, entity_id);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view activities from their organization
CREATE POLICY "allow_organization_activities_access"
    ON public.activities
    FOR SELECT
    USING (
        organization_id = (
            SELECT organization_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- RLS Policy: System can insert activities (for triggers)
CREATE POLICY "allow_activity_insert"
    ON public.activities
    FOR INSERT
    WITH CHECK (
        organization_id = (
            SELECT organization_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Function to log lead activities
CREATE OR REPLACE FUNCTION log_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activities (organization_id, user_id, entity_type, entity_id, action_type, description)
        VALUES (
            NEW.organization_id,
            auth.uid(),
            'lead',
            NEW.id,
            'create',
            'Novo lead criado: ' || NEW.full_name
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.activities (organization_id, user_id, entity_type, entity_id, action_type, description)
        VALUES (
            NEW.organization_id,
            auth.uid(),
            'lead',
            NEW.id,
            'status_change',
            'Status do lead ' || NEW.full_name || ' alterado de "' || OLD.status || '" para "' || NEW.status || '"'
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.classification != NEW.classification AND NEW.classification = 'cliente' THEN
        INSERT INTO public.activities (organization_id, user_id, entity_type, entity_id, action_type, description)
        VALUES (
            NEW.organization_id,
            auth.uid(),
            'lead',
            NEW.id,
            'update',
            'Lead ' || NEW.full_name || ' convertido em cliente'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log property activities
CREATE OR REPLACE FUNCTION log_property_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activities (organization_id, user_id, entity_type, entity_id, action_type, description)
        VALUES (
            NEW.organization_id,
            auth.uid(),
            'property',
            NEW.id,
            'create',
            'Novo imóvel cadastrado: ' || NEW.title
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.activities (organization_id, user_id, entity_type, entity_id, action_type, description)
        VALUES (
            NEW.organization_id,
            auth.uid(),
            'property',
            NEW.id,
            'status_change',
            'Status do imóvel ' || NEW.title || ' alterado para "' || NEW.status || '"'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_log_lead_activity ON public.leads;
CREATE TRIGGER trigger_log_lead_activity
    AFTER INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION log_lead_activity();

DROP TRIGGER IF EXISTS trigger_log_property_activity ON public.properties;
CREATE TRIGGER trigger_log_property_activity
    AFTER INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION log_property_activity();
