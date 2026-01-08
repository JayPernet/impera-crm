-- CRIAR TABLE DE HISTÓRICO E FILA DE MENSAGENS DO WHATSAPP
CREATE TABLE IF NOT EXISTS n8n_historico_mensagens (
  id           BIGSERIAL PRIMARY KEY,
  session_id   VARCHAR(40) NOT NULL,
  message      JSONB NOT NULL,
  created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_n8n_historico_mensagens_session_id ON n8n_historico_mensagens (session_id);

CREATE TABLE IF NOT EXISTS n8n_fila_mensagens (
  id           BIGSERIAL PRIMARY KEY,
  id_mensagem  VARCHAR(40) NOT NULL,
  telefone     VARCHAR(40) NOT NULL,
  mensagem     TEXT NOT NULL,
  "timestamp"  TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_n8n_fila_mensagens_telefone ON n8n_fila_mensagens (telefone);

-- CRIAR TRIGGER PARA EVITAR UM BUG DE TIMESTAMP
CREATE OR REPLACE FUNCTION set_created_at_if_null()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_at IS NULL THEN
    NEW.created_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_set_created_at
  BEFORE INSERT ON n8n_historico_mensagens
  FOR EACH ROW
  EXECUTE FUNCTION set_created_at_if_null();

-- CRIAR TABLE DE FOLLOW-UP
CREATE TABLE IF NOT EXISTS fup_status (
    -- Chave Primária Autogerada (id)
    "id" BIGSERIAL PRIMARY KEY,
    
    -- ID Único para Rastreamento (Substitui 'session_id')
    "whatsapp" VARCHAR(40) NOT NULL UNIQUE, 
    
    -- Status do Lead
    "status" VARCHAR(50) NOT NULL DEFAULT 'em_atendimento', 
    
    -- Data/Hora do Último Contato (Substitui 'last_contact_at')
    "hora_mensagem" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
    
    -- Campos Adicionais para o Update (Aceitam NULL inicialmente)
    "nome" TEXT, -- Usado no Update
    "resposta_iana" TEXT, -- Usado no Update
    "mensagem_lead" TEXT -- Usado no Update
);

-- Cria um índice para otimizar buscas pelo WhatsApp (chave de filtro no n8n)
CREATE UNIQUE INDEX IF NOT EXISTS idx_fup_status_whatsapp ON fup_status ("whatsapp");

-- CRON PARA LIMPAR HISTÓRICO LONGO NO DB
CREATE OR REPLACE FUNCTION limpar_historico_antigo()
RETURNS void AS $$
BEGIN
  DELETE FROM n8n_historico_mensagens
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at DESC) as rn
      FROM n8n_historico_mensagens
    ) ranked
    WHERE rn > 30
  );
END;
$$ LANGUAGE plpgsql;

-- Agendar execução a cada 29 dias
SELECT cron.schedule(
  'limpar-historico-29-dias',
  '0 0 */29 * *',
  'SELECT limpar_historico_antigo();'
);


-- CRIAR CRON PARA FAZER FOLLOW-UP
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;
create extension if not exists pg_net;

create or replace function disparar_followup()
returns void
language plpgsql
as $$
declare
  r record;
  minutos_diff int;
  agora timestamp := now() at time zone 'America/Sao_Paulo';
  dia_da_semana int := extract(dow from agora);
  hora_do_dia int := extract(hour from agora);
begin
  -- Verificar se está dentro dos horários comerciais
  -- Segunda a sexta (8h-20h) ou sábado (9h-15h), nunca domingo
  if (dia_da_semana >= 1 and dia_da_semana <= 5 and hora_do_dia >= 8 and hora_do_dia < 20) or
     (dia_da_semana = 6 and hora_do_dia >= 9 and hora_do_dia < 15) then
    for r in
      select id, status, hora_mensagem, mensagem_lead, resposta_iana, whatsapp, nome
      from fup_status
      where status in ('aguardando_resposta', 'fup1', 'fup2', 'fup3', 'fup4')
    loop
      minutos_diff := round(extract(epoch from agora - r.hora_mensagem at time zone 'America/Sao_Paulo') / 60);

      if r.status = 'aguardando_resposta' and minutos_diff >= 5 then
        raise notice 'Disparando FUP1 para id %', r.id;
        
        perform net.http_post(
          url := 'https://n8n.gbmarketingdigital.com.br/webhook/74ff651e-iBrooker-fup-875b-9004f7357505',
          headers := jsonb_build_object('Content-Type', 'application/json'),
          body := jsonb_build_object(
            'cliente_id', r.id,
            'status_atual', 'aguardando_resposta',
            'mensagem_lead', r.mensagem_lead,
            'resposta_iana', r.resposta_iana,
            'whatsapp', r.whatsapp,
            'nome', r.nome
          )
        );
        
      elsif r.status = 'fup1' and minutos_diff >= 30 then
        raise notice 'Disparando FUP2 para id %', r.id;
        
        perform net.http_post(
          url := 'https://n8n.gbmarketingdigital.com.br/webhook/74ff651e-iBrooker-fup-875b-9004f7357505',
          headers := jsonb_build_object('Content-Type', 'application/json'),
          body := jsonb_build_object(
            'cliente_id', r.id,
            'status_atual', 'fup1',
            'mensagem_lead', r.mensagem_lead,
            'resposta_iana', r.resposta_iana,
            'whatsapp', r.whatsapp,
            'nome', r.nome
          )
        );
        
      elsif r.status = 'fup2' and minutos_diff >= 120 then -- 2 horas
        raise notice 'Disparando FUP3 para id %', r.id;
        
        perform net.http_post(
          url := 'https://n8n.gbmarketingdigital.com.br/webhook/74ff651e-iBrooker-fup-875b-9004f7357505',
          headers := jsonb_build_object('Content-Type', 'application/json'),
          body := jsonb_build_object(
            'cliente_id', r.id,
            'status_atual', 'fup2',
            'mensagem_lead', r.mensagem_lead,
            'resposta_iana', r.resposta_iana,
            'whatsapp', r.whatsapp,
            'nome', r.nome
          )
        );
        
      elsif r.status = 'fup3' and minutos_diff >= 720 then -- 12 horas
        raise notice 'Disparando FUP4 para id %', r.id;
        
        perform net.http_post(
          url := 'https://n8n.gbmarketingdigital.com.br/webhook/74ff651e-iBrooker-fup-875b-9004f7357505',
          headers := jsonb_build_object('Content-Type', 'application/json'),
          body := jsonb_build_object(
            'cliente_id', r.id,
            'status_atual', 'fup3',
            'mensagem_lead', r.mensagem_lead,
            'resposta_iana', r.resposta_iana,
            'whatsapp', r.whatsapp,
            'nome', r.nome
          )
        );
        
      elsif r.status = 'fup4' and minutos_diff >= 1440 then -- 24 horas
        raise notice 'Disparando FUP5 para id %', r.id;
        
        perform net.http_post(
          url := '<webhook-que-fará-followup-conforme-imobiliaria>',
          headers := jsonb_build_object('Content-Type', 'application/json'),
          body := jsonb_build_object(
            'cliente_id', r.id,
            'status_atual', 'fup4',
            'mensagem_lead', r.mensagem_lead,
            'resposta_iana', r.resposta_iana,
            'whatsapp', r.whatsapp,
            'nome', r.nome
          )
        );
        
      end if;
    end loop;
  else
    raise notice 'Fora do horário comercial. Nenhum follow-up disparado.';
  end if;
end;
$$;

-- Agendamento para segunda a sexta, 8h-20h (-03) = 11h-23h UTC
select cron.schedule(
  'followup_check_weekdays',
  '*/5 11-23 * * 1-5',
  $$ select disparar_followup(); $$
);

-- Agendamento para sábados, 9h-15h (-03) = 12h-18h UTC
select cron.schedule(
  'followup_check_saturday',
  '*/5 12-18 * * 6',
  $$ select disparar_followup(); $$
);

-- CRIAR BUCKET PARA A FOTO DO IMÓVEL
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fotos_imoveis', 'fotos_imoveis', true)
ON CONFLICT (id) DO NOTHING;

-- TABLE BANCO CLIENTES (USADA PELA IA DE ATENDIMENTO NO WHATSAPP)
-- PODE SER REAPROVEITADA PARA CLIENTES DE UMA RESPECTIVA IMOBILIÁRIA NO CRM
CREATE TABLE IF NOT EXISTS banco_clientes (
    -- ID e Chave Primária
    -- BIGSERIAL é a forma padrão no PostgreSQL para um BIGINT auto-incremental
    id BIGSERIAL PRIMARY KEY, 
    
    -- Contato
    whatsapp VARCHAR(20) UNIQUE NOT NULL,
    
    -- Interação
    ultimo_contato TIMESTAMPTZ,
    
    -- Notas e Resumo
    resumo TEXT 
);

-- TABLE BANCO IMÓVEIS (USADA PELA IA DE ATENDIMENTO NO WHATSAPP)
-- PODE SER REAPROVEITADA PARA IMÓVEIS DE UMA RESPECTIVA IMOBILIÁRIA NO CRM
-- MEIO QUE PODE SER MESCLADA COM A TABELA `properties`
CREATE TABLE IF NOT EXISTS banco_imoveis (
    -- ID e Identificação
    listing_id TEXT PRIMARY KEY,
    titulo TEXT,
    
    -- Tipo de Transação e Propriedade
    tipo_transacao TEXT,         -- Ex: 'For Rent' (Aluguel), 'For Sale' (Venda)
    tipo_uso TEXT,               -- Ex: 'Commercial' (Comercial), 'Residential' (Residencial)
    tipo_propriedade TEXT,       -- Ex: 'Apartment', 'Home', 'Commercial / Office'
    
    -- Descrição e Preço
    descricao TEXT,
    preco NUMERIC,               -- Armazena RentalPrice ou ListPrice
    
    -- Localização
    pais TEXT,                   -- Country
    estado TEXT,                 -- State
    cidade TEXT,                 -- City
    bairro TEXT,                 -- Neighborhood
    endereco TEXT,               -- Address (Rua, Av.)
    numero TEXT,                 -- StreetNumber
    complemento TEXT,            -- Complement
    cep TEXT,                    -- PostalCode
    latitude NUMERIC,
    longitude NUMERIC,
    
    -- Detalhes do Imóvel
    area_total_m2 NUMERIC,       -- LotArea (área total em metros quadrados)
    dormitorios INTEGER,         -- Bedrooms
    suites INTEGER,              -- Suites (aparece em alguns listings)
    banheiros INTEGER,           -- Bathrooms
    vagas_garagem INTEGER,       -- Garage (número de vagas)
    andar_unidade INTEGER,       -- UnitFloor (andar/piso da unidade)

    -- Links
    url_detalhe TEXT,            -- DetailViewUrl
    url_imagem_principal TEXT    -- URL da imagem primária (Media/Item primary="true")
);

-- TABLE PARA EVITAR PAUSAR PROJETO NO SUPABASE
-- Criação da tabela keepalive
CREATE TABLE IF NOT EXISTS keepalive (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);