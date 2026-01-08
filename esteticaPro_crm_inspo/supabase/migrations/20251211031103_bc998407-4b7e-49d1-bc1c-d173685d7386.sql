-- =============================================
-- TRIGGER 1: Conversão Lead → Cliente
-- =============================================
CREATE OR REPLACE FUNCTION public.convert_lead_to_client()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead RECORD;
  v_procedure RECORD;
  v_client_id UUID;
  v_existing_client_id UUID;
  v_return_date TIMESTAMP WITH TIME ZONE;
  v_task_user_id UUID;
BEGIN
  -- Only process if status changed to 'completed' and there's a lead_id
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.lead_id IS NOT NULL THEN
    
    -- Get lead data
    SELECT * INTO v_lead FROM crm_leads WHERE id = NEW.lead_id;
    
    -- Get procedure data if exists
    IF NEW.procedure_id IS NOT NULL THEN
      SELECT * INTO v_procedure FROM crm_procedures WHERE id = NEW.procedure_id;
    END IF;
    
    -- Calculate return date if procedure has return_days
    IF v_procedure IS NOT NULL AND v_procedure.return_days > 0 THEN
      v_return_date := NOW() + (v_procedure.return_days || ' days')::INTERVAL;
    ELSE
      v_return_date := NULL;
    END IF;
    
    -- Check if client already exists for this lead
    SELECT id INTO v_existing_client_id FROM crm_clients WHERE lead_id = NEW.lead_id;
    
    IF v_existing_client_id IS NULL THEN
      -- Create new client
      INSERT INTO crm_clients (
        organization_id,
        lead_id,
        name,
        phone,
        email,
        converted_at,
        last_appointment_at,
        total_appointments,
        estimated_revenue,
        next_return_at,
        notes
      ) VALUES (
        NEW.organization_id,
        NEW.lead_id,
        v_lead.name,
        v_lead.phone,
        v_lead.email,
        NOW(),
        NOW(),
        1,
        COALESCE(NEW.value, 0),
        v_return_date,
        v_lead.notes
      )
      RETURNING id INTO v_client_id;
      
      -- Create auto-return task if procedure has return_days
      IF v_procedure IS NOT NULL AND v_procedure.return_days > 0 THEN
        -- Get a user from the organization to assign the task
        SELECT id INTO v_task_user_id FROM crm_users 
        WHERE organization_id = NEW.organization_id AND active = true 
        LIMIT 1;
        
        IF v_task_user_id IS NOT NULL THEN
          INSERT INTO crm_tasks (
            task_type,
            title,
            description,
            due_date,
            client_id,
            organization_id,
            user_id,
            priority,
            status
          ) VALUES (
            'auto_return',
            'Retorno de ' || v_procedure.name || ' - ' || v_lead.name,
            'Tarefa automática de retorno gerada pelo sistema.',
            v_return_date,
            v_client_id,
            NEW.organization_id,
            v_task_user_id,
            'medium',
            'pending'
          );
        END IF;
      END IF;
      
      -- Update the appointment with the new client_id
      NEW.client_id := v_client_id;
      
    ELSE
      -- Update existing client
      UPDATE crm_clients SET
        last_appointment_at = NOW(),
        total_appointments = total_appointments + 1,
        estimated_revenue = estimated_revenue + COALESCE(NEW.value, 0),
        next_return_at = v_return_date
      WHERE id = v_existing_client_id;
      
      -- Update the appointment with existing client_id
      NEW.client_id := v_existing_client_id;
      
      -- Create auto-return task for existing client if procedure has return_days
      IF v_procedure IS NOT NULL AND v_procedure.return_days > 0 THEN
        SELECT id INTO v_task_user_id FROM crm_users 
        WHERE organization_id = NEW.organization_id AND active = true 
        LIMIT 1;
        
        IF v_task_user_id IS NOT NULL THEN
          INSERT INTO crm_tasks (
            task_type,
            title,
            description,
            due_date,
            client_id,
            organization_id,
            user_id,
            priority,
            status
          ) VALUES (
            'auto_return',
            'Retorno de ' || v_procedure.name || ' - ' || v_lead.name,
            'Tarefa automática de retorno gerada pelo sistema.',
            v_return_date,
            v_existing_client_id,
            NEW.organization_id,
            v_task_user_id,
            'medium',
            'pending'
          );
        END IF;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for lead to client conversion
DROP TRIGGER IF EXISTS trigger_convert_lead_to_client ON crm_appointments;
CREATE TRIGGER trigger_convert_lead_to_client
  BEFORE UPDATE ON crm_appointments
  FOR EACH ROW
  EXECUTE FUNCTION convert_lead_to_client();

-- =============================================
-- TRIGGER 2: Atualizar Última Interação
-- =============================================
CREATE OR REPLACE FUNCTION public.update_lead_last_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE crm_leads 
  SET 
    last_interaction_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.lead_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for updating last interaction
DROP TRIGGER IF EXISTS trigger_update_last_interaction ON crm_interactions;
CREATE TRIGGER trigger_update_last_interaction
  AFTER INSERT ON crm_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_last_interaction();

-- =============================================
-- TRIGGER 3: Auto-atualizar Status de Lead ao Agendar
-- =============================================
CREATE OR REPLACE FUNCTION public.update_lead_status_on_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only update if lead_id is provided and lead status is not already 'scheduled'
  IF NEW.lead_id IS NOT NULL THEN
    UPDATE crm_leads
    SET 
      status = 'scheduled',
      updated_at = NOW()
    WHERE id = NEW.lead_id AND status != 'scheduled';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for updating lead status on appointment creation
DROP TRIGGER IF EXISTS trigger_update_lead_status_on_appointment ON crm_appointments;
CREATE TRIGGER trigger_update_lead_status_on_appointment
  AFTER INSERT ON crm_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_status_on_appointment();