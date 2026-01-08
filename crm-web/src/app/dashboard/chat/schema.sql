
-- Tabela de Mensagens
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete cascade,
  sender text check (sender in ('user', 'lead')),
  content text not null,
  created_at timestamptz default now(),
  is_read boolean default false
);

create index if not exists idx_messages_lead_id on messages(lead_id);
