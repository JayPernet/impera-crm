-- Adicionar coluna ai_active para controle de IA no lead
ALTER TABLE public.crm_leads 
ADD COLUMN ai_active BOOLEAN DEFAULT TRUE;

-- Comentário explicativo
COMMENT ON COLUMN public.crm_leads.ai_active IS 'Controle de IA: true = IA responde automaticamente, false = humano assumiu';