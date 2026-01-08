-- =============================================================
-- FASE 1: DELETAR TABELAS DUPLICADAS (sem prefixo crm_)
-- =============================================================

-- Remover tabelas de junção primeiro (dependem das tabelas principais)
DROP TABLE IF EXISTS public.lead_tags CASCADE;
DROP TABLE IF EXISTS public.lead_procedures CASCADE;
DROP TABLE IF EXISTS public.interactions CASCADE;

-- Remover tabelas dependentes
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.anamnesis CASCADE;

-- Remover tabelas principais
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.procedures CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- =============================================================
-- FASE 2: CRIAR FUNÇÃO RPC PARA NPS
-- =============================================================

CREATE OR REPLACE FUNCTION public.get_client_for_nps(token_input UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'client_id', c.id,
    'name', c.name,
    'organization_id', c.organization_id,
    'organization_name', o.name,
    'google_business_url', NULL
  )
  INTO result
  FROM crm_clients c
  JOIN crm_organizations o ON o.id = c.organization_id
  WHERE c.nps_token = token_input;
  
  RETURN result;
END;
$$;