-- Create client_procedures table (many-to-many)
CREATE TABLE public.crm_client_procedures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES public.crm_procedures(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id, procedure_id)
);

-- Create professional_procedures table (many-to-many)
CREATE TABLE public.crm_professional_procedures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.crm_users(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES public.crm_procedures(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(professional_id, procedure_id)
);

-- Enable RLS on new tables
ALTER TABLE public.crm_client_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_professional_procedures ENABLE ROW LEVEL SECURITY;

-- RLS policies for crm_client_procedures
CREATE POLICY "Org users access own client_procedures"
ON public.crm_client_procedures
FOR ALL
USING (
  client_id IN (
    SELECT id FROM public.crm_clients 
    WHERE organization_id = get_user_organization_id(auth.uid())
  )
);

CREATE POLICY "Super admins full access client_procedures"
ON public.crm_client_procedures
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- RLS policies for crm_professional_procedures
CREATE POLICY "Org users access own professional_procedures"
ON public.crm_professional_procedures
FOR ALL
USING (
  professional_id IN (
    SELECT id FROM public.crm_users 
    WHERE organization_id = get_user_organization_id(auth.uid())
  )
);

CREATE POLICY "Super admins full access professional_procedures"
ON public.crm_professional_procedures
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_crm_client_procedures_client_id ON public.crm_client_procedures(client_id);
CREATE INDEX idx_crm_client_procedures_procedure_id ON public.crm_client_procedures(procedure_id);
CREATE INDEX idx_crm_professional_procedures_professional_id ON public.crm_professional_procedures(professional_id);
CREATE INDEX idx_crm_professional_procedures_procedure_id ON public.crm_professional_procedures(procedure_id);