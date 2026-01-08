
-- Criar registro em crm_users para vincular à organização GMZ
INSERT INTO crm_users (
  supabase_auth_id,
  organization_id,
  email,
  name,
  active
) VALUES (
  '73719ef6-412e-4e61-a930-627af8fc3579',
  'a0000000-0000-0000-0000-000000000001',
  'ludmylla.soliveira@gmail.com',
  'Ludmylla Oliveira',
  true
);
