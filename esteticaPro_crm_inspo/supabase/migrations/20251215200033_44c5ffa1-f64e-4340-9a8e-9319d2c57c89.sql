-- Tabela de Anamnese vinculada ao CRM
CREATE TABLE IF NOT EXISTS public.crm_anamnesis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.crm_organizations(id) ON DELETE CASCADE,

  -- Grupo A: Queixa Principal & Expectativas
  main_complaint TEXT,
  expectation TEXT,
  history_current_problem TEXT,

  -- Grupo B: Histórico Clínico (Segurança)
  allergies TEXT,
  medications_in_use TEXT,
  chronic_diseases TEXT[],
  surgeries_implants TEXT,
  is_pregnant_or_breastfeeding BOOLEAN DEFAULT FALSE,

  -- Grupo C: Hábitos & Estilo de Vida
  lifestyle_habits TEXT[],
  sun_exposure TEXT,
  water_intake TEXT,
  sleep_quality TEXT,
  intestinal_function TEXT,

  -- Grupo D: Histórico Estético
  previous_procedures TEXT,
  adverse_reactions TEXT,
  home_care_routine TEXT,

  -- Grupo E: Avaliação Física
  skin_phototype TEXT,
  skin_type TEXT,

  -- Observações gerais
  professional_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Apenas uma anamnese por cliente
  UNIQUE(client_id)
);

-- Habilita RLS
ALTER TABLE public.crm_anamnesis ENABLE ROW LEVEL SECURITY;

-- Política para usuários da organização
CREATE POLICY "Org users access own anamnesis"
ON public.crm_anamnesis
FOR ALL
USING (organization_id = get_user_organization_id(auth.uid()));

-- Política para super admins
CREATE POLICY "Super admins full access anamnesis"
ON public.crm_anamnesis
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_crm_anamnesis_updated_at
  BEFORE UPDATE ON public.crm_anamnesis
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_updated_at();