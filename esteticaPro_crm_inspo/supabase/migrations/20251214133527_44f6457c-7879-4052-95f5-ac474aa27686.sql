-- Create triggers for the existing functions

-- 1. Trigger: Convert Lead to Client when appointment is completed
DROP TRIGGER IF EXISTS trigger_convert_lead_to_client ON crm_appointments;
CREATE TRIGGER trigger_convert_lead_to_client
  BEFORE UPDATE ON crm_appointments
  FOR EACH ROW
  EXECUTE FUNCTION convert_lead_to_client();

-- 2. Trigger: Update Lead's last_interaction_at when interaction is created
DROP TRIGGER IF EXISTS trigger_update_lead_last_interaction ON crm_interactions;
CREATE TRIGGER trigger_update_lead_last_interaction
  AFTER INSERT ON crm_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_last_interaction();

-- 3. Trigger: Auto-update lead status to 'scheduled' when appointment is created
DROP TRIGGER IF EXISTS trigger_update_lead_status_on_appointment ON crm_appointments;
CREATE TRIGGER trigger_update_lead_status_on_appointment
  AFTER INSERT ON crm_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_status_on_appointment();

-- Insert missing user roles
INSERT INTO user_roles (user_id, role) 
VALUES 
  ('ea53a769-f093-470a-9f1b-53cb5a8c5d2a', 'admin'),
  ('ba8230ff-8b30-4d77-bd51-0414e516a241', 'user'),
  ('4dcaa93d-6ab6-4f8f-8975-257b3f871f00', 'professional')
ON CONFLICT (user_id, role) DO NOTHING;