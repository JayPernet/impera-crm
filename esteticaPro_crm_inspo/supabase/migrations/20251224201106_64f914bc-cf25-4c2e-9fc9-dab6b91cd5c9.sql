-- Add active column to crm_clients
ALTER TABLE public.crm_clients 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Create index for better performance on active filter
CREATE INDEX IF NOT EXISTS idx_crm_clients_active ON public.crm_clients(active);

-- Add delete function for clients
CREATE OR REPLACE FUNCTION public.delete_client(p_client_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete related appointments
  DELETE FROM crm_appointments WHERE client_id = p_client_id;
  
  -- Delete related anamnesis
  DELETE FROM crm_anamnesis WHERE client_id = p_client_id;
  
  -- Delete related client procedures
  DELETE FROM crm_client_procedures WHERE client_id = p_client_id;
  
  -- Delete the client
  DELETE FROM crm_clients WHERE id = p_client_id;
END;
$$;