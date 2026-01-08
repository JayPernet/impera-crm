
-- Create enums
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');
CREATE TYPE public.source_type AS ENUM ('ads', 'organic', 'indication', 'other');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'scheduled', 'lost');
CREATE TYPE public.temperature AS ENUM ('cold', 'warm', 'hot');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.task_type AS ENUM ('manual', 'auto_return', 'system');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.task_status AS ENUM ('pending', 'completed');
CREATE TYPE public.interaction_type AS ENUM ('whatsapp', 'call', 'note', 'status_change');

-- Organizations table
CREATE TABLE public.crm_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp_identifier TEXT,
  settings JSONB DEFAULT '{"theme": "light"}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (separate from profile for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- CRM Users table
CREATE TABLE public.crm_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  supabase_auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tags table
CREATE TABLE public.crm_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#D4AF37',
  marked_for_deletion BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Procedures table
CREATE TABLE public.crm_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  suggested_price NUMERIC(10,2) DEFAULT 0,
  return_days INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads table
CREATE TABLE public.crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  source_type source_type DEFAULT 'other',
  source_detail TEXT,
  status lead_status DEFAULT 'new',
  temperature temperature DEFAULT 'cold',
  assigned_to UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  marked_for_deletion BOOLEAN DEFAULT false,
  first_contact_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ,
  current_proposal TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients table (converted leads)
CREATE TABLE public.crm_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  converted_at TIMESTAMPTZ DEFAULT now(),
  last_appointment_at TIMESTAMPTZ,
  next_return_at TIMESTAMPTZ,
  total_appointments INTEGER DEFAULT 0,
  estimated_revenue NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead tags junction table
CREATE TABLE public.crm_lead_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.crm_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lead_id, tag_id)
);

-- Lead procedures junction table
CREATE TABLE public.crm_lead_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE NOT NULL,
  procedure_id UUID REFERENCES public.crm_procedures(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lead_id, procedure_id)
);

-- Interactions table
CREATE TABLE public.crm_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  type interaction_type NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments table
CREATE TABLE public.crm_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.crm_clients(id) ON DELETE SET NULL,
  procedure_id UUID REFERENCES public.crm_procedures(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  value NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks table
CREATE TABLE public.crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.crm_users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  task_type task_type DEFAULT 'manual',
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.crm_clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS on all tables
ALTER TABLE public.crm_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's organization_id
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_auth_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.crm_users WHERE supabase_auth_id = _auth_id LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for crm_organizations
CREATE POLICY "Super admins can manage all organizations" ON public.crm_organizations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view own organization" ON public.crm_organizations
  FOR SELECT TO authenticated
  USING (id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for crm_users
CREATE POLICY "Super admins can manage all users" ON public.crm_users
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view users in same org" ON public.crm_users
  FOR SELECT TO authenticated
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Admins can manage users in same org" ON public.crm_users
  FOR ALL TO authenticated
  USING (
    organization_id = public.get_user_organization_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- Standard RLS for org-scoped tables (tags, procedures, leads, clients, etc.)
CREATE POLICY "Super admins full access tags" ON public.crm_tags
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own tags" ON public.crm_tags
  FOR ALL TO authenticated
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access procedures" ON public.crm_procedures
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own procedures" ON public.crm_procedures
  FOR ALL TO authenticated
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access leads" ON public.crm_leads
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own leads" ON public.crm_leads
  FOR ALL TO authenticated
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access clients" ON public.crm_clients
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own clients" ON public.crm_clients
  FOR ALL TO authenticated
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access lead_tags" ON public.crm_lead_tags
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own lead_tags" ON public.crm_lead_tags
  FOR ALL TO authenticated
  USING (
    lead_id IN (SELECT id FROM public.crm_leads WHERE organization_id = public.get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Super admins full access lead_procedures" ON public.crm_lead_procedures
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own lead_procedures" ON public.crm_lead_procedures
  FOR ALL TO authenticated
  USING (
    lead_id IN (SELECT id FROM public.crm_leads WHERE organization_id = public.get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Super admins full access interactions" ON public.crm_interactions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own interactions" ON public.crm_interactions
  FOR ALL TO authenticated
  USING (
    lead_id IN (SELECT id FROM public.crm_leads WHERE organization_id = public.get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Super admins full access appointments" ON public.crm_appointments
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Org users access own appointments" ON public.crm_appointments
  FOR ALL TO authenticated
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access tasks" ON public.crm_tasks
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can manage own tasks" ON public.crm_tasks
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM public.crm_users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Admins can view org tasks" ON public.crm_tasks
  FOR SELECT TO authenticated
  USING (
    organization_id = public.get_user_organization_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- Trigger to update last_interaction_at on leads
CREATE OR REPLACE FUNCTION public.update_lead_last_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.crm_leads SET last_interaction_at = NEW.created_at WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_interaction_created
  AFTER INSERT ON public.crm_interactions
  FOR EACH ROW EXECUTE FUNCTION public.update_lead_last_interaction();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_crm_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_crm_organizations_updated_at
  BEFORE UPDATE ON public.crm_organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();

CREATE TRIGGER update_crm_users_updated_at
  BEFORE UPDATE ON public.crm_users
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();

CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();

CREATE TRIGGER update_crm_appointments_updated_at
  BEFORE UPDATE ON public.crm_appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();

-- Create indexes for performance
CREATE INDEX idx_crm_users_org ON public.crm_users(organization_id);
CREATE INDEX idx_crm_users_auth ON public.crm_users(supabase_auth_id);
CREATE INDEX idx_crm_leads_org ON public.crm_leads(organization_id);
CREATE INDEX idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX idx_crm_clients_org ON public.crm_clients(organization_id);
CREATE INDEX idx_crm_appointments_org ON public.crm_appointments(organization_id);
CREATE INDEX idx_crm_appointments_scheduled ON public.crm_appointments(scheduled_at);
CREATE INDEX idx_crm_tasks_user ON public.crm_tasks(user_id);
CREATE INDEX idx_crm_tasks_due ON public.crm_tasks(due_date);
