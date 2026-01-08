-- Create a test organization
INSERT INTO crm_organizations (id, name, active, settings)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Clínica GMZ Estética', true, '{"theme": "light"}')
ON CONFLICT (id) DO NOTHING;

-- Create crm_users for the remaining users (linked to the test org)
INSERT INTO crm_users (supabase_auth_id, organization_id, email, name, active)
VALUES 
  ('ea53a769-f093-470a-9f1b-53cb5a8c5d2a', 'a0000000-0000-0000-0000-000000000001', 'pernetgestor@gmail.com', 'Admin Gestor', true),
  ('ba8230ff-8b30-4d77-bd51-0414e516a241', 'a0000000-0000-0000-0000-000000000001', 'ludmylla.soliveira@gmail.com', 'Ludmylla Oliveira', true),
  ('4dcaa93d-6ab6-4f8f-8975-257b3f871f00', 'a0000000-0000-0000-0000-000000000001', 'gmzestetica@gmail.com', 'GMZ Professional', true)
ON CONFLICT (supabase_auth_id) DO NOTHING;