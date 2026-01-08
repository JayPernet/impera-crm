-- Adicionar campos para controle de chat na tabela crm_interactions
ALTER TABLE crm_interactions 
ADD COLUMN is_inbound BOOLEAN DEFAULT FALSE,
ADD COLUMN read BOOLEAN DEFAULT TRUE,
ADD COLUMN media_url TEXT,
ADD COLUMN message_id TEXT;

-- Index para deixar o chat rápido
CREATE INDEX idx_crm_interactions_chat ON crm_interactions(lead_id, created_at DESC);
CREATE INDEX idx_crm_interactions_unread ON crm_interactions(lead_id, read) WHERE read = FALSE;