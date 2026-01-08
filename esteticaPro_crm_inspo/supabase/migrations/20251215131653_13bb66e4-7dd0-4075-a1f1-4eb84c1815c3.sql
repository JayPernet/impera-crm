
-- 1. Criar ENUMs necessários
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'user', 'professional');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar coluna role à tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role;

-- 3. Função auxiliar para obter organization_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS uuid AS $$
  SELECT organization_id FROM public.users WHERE supabase_auth_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- 4. Colunas extras nas organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS token_z_api TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS id_instancia_z_api TEXT;

-- 5. Habilitar RLS em todas as tabelas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies
DROP POLICY IF EXISTS "Super Admins can view/edit all organizations, others can view their own." ON organizations;
DROP POLICY IF EXISTS "User isolation by organization_id and self-access." ON users;
DROP POLICY IF EXISTS "org_isolation" ON leads;
DROP POLICY IF EXISTS "org_isolation" ON tags;
DROP POLICY IF EXISTS "org_isolation" ON procedures;
DROP POLICY IF EXISTS "lead_tag_isolation" ON lead_tags;
DROP POLICY IF EXISTS "lead_procedure_isolation" ON lead_procedures;
DROP POLICY IF EXISTS "interaction_isolation" ON interactions;
DROP POLICY IF EXISTS "org_isolation" ON appointments;
DROP POLICY IF EXISTS "task_isolation" ON tasks;

-- 7. Criar policies

-- ORGANIZATIONS
CREATE POLICY "Super Admins can view/edit all organizations, others can view their own." ON organizations FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR id = get_user_org_id()
);

-- USERS
CREATE POLICY "User isolation by organization_id and self-access." ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR organization_id = get_user_org_id()
  OR supabase_auth_id = auth.uid()
);

-- LEADS
CREATE POLICY "org_isolation" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR organization_id = get_user_org_id()
);

-- TAGS
CREATE POLICY "org_isolation" ON tags FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR organization_id = get_user_org_id()
);

-- PROCEDURES
CREATE POLICY "org_isolation" ON procedures FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR organization_id = get_user_org_id()
);

-- LEAD_TAGS
CREATE POLICY "lead_tag_isolation" ON lead_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id())
);

-- LEAD_PROCEDURES
CREATE POLICY "lead_procedure_isolation" ON lead_procedures FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id())
);

-- INTERACTIONS
CREATE POLICY "interaction_isolation" ON interactions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id())
);

-- APPOINTMENTS
CREATE POLICY "org_isolation" ON appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR organization_id = get_user_org_id()
);

-- TASKS
CREATE POLICY "task_isolation" ON tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE supabase_auth_id = auth.uid() AND role = 'super_admin')
  OR organization_id = get_user_org_id()
  OR user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid())
  OR created_by IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid())
);
