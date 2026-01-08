## 🎯 FASE 4: Chat & Automação

### PRP-004: Unified Inbox & n8n Integration

**Objetivo:** Centralizar o atendimento via WhatsApp (Oficial ou Não-Oficial) em uma Inbox unificada dentro do CRM, integrando com o n8n para automações.

---

### 🧠 Validação (Ricardo's Methodology)

**1. A Gambiarra (Workaround):**
*Corretores trabalham com duas telas: CRM (web) e WhatsApp Web aberto, copiando e colando dados de um lado para o outro.*

**2. O Ódio Tolerado (Pain Point):**
*O dono da imobiliária "aceita" perder o histórico da conversa quando o corretor apaga as mensagens ou sai da empresa.*

**3. A Customização (Feature Gap):**
*Uso de ferramentas externas caras (Zenvia, RD Station) apenas para fazer o "primeiro contato", desconectado do funil de vendas.*

---

### ✍️ Copy Insights (Handover para Pamela)

- **Headline Pain:** "Quem é dono do cliente: Você ou o celular do corretor?"
- **Value Prop:** "Uma Inbox, todos os corretores. Histórico salvo, leads protegidos."
- **Feature Hero:** "Chat Universal: Atenda, venda e automatize sem sair do CRM."

---

#### ✅ Checklist de Completude (Validar antes de executar)

**1. Contexto e Escopo**
- [x] Objetivo: Inbox real-time e infra para bots.
- [x] Dependências: `leads` (para vincular chats), `n8n_historico_mensagens`.
- [x] Escopo: Lista de Conversas, Janela de Chat, Envio de Mídia/Áudio.

**2. Especificações de Layout**
- [x] **Inbox Layout:** Estilo WhatsApp Web/Messenger (Sidebar esquerda com chats, Direita com thread).
- [x] **Chat Bubble:** Design distinto para "Humano" vs "Bot" vs "Lead".
- [x] **Status Indicator:** `Aguardando`, `Respondido`, `Bot Ativo`.

**3. Detalhamento de Componentes**
- [x] **Message Input:** Suporte a Emoji e Enter-to-send.
- [x] **Quick Replies:** Botões de resposta rápida (Canned Responses).
- [x] **Lead Sidebar:** Ao abrir chat, mostrar resumo do Lead (Cards de imóveis, Tags) na lateral direita.

**4. Integração com Backend**
- [x] **Tabela `n8n_historico_mensagens`:** Polling ou Realtime Subscription para novas mensagens.
- [x] **Webhook de Saída:** Enviar msg do corretor -> API do n8n -> WhatsApp.
- [x] **Media Handling:** Exibir imagens/áudios armazenados no bucket (ou URLs externas).

**5. Automação**
- [x] **Bot Handoff:** Botão "Assumir Conversa" que pausa o bot do n8n.

---

#### 📋 Especificação Técnica

**Arquitetura:**
- `src/app/dashboard/chat/page.tsx`: Layout principal.
- `src/components/chat/chat-sidebar.tsx`: Lista de contatos.
- `src/components/chat/chat-window.tsx`: Area de mensagens.
- `src/components/chat/chat-input.tsx`: Área de digitação.

**Desafios:**
- **Real-time:** Implementar `supabase.channel` para atualizar mensagens instantaneamente.
- **Optimistic UI:** Mensagem enviada aparece na hora (status `sending`), depois confirma (`sent`).

---

#### 🔗 Relacionamentos

**Depende de:**
- PRP-003 (Leads criados)
- Instância n8n rodando

**Bloqueia:**
- Feature "Disparo em Massa" (Marketing)

---

*Criado em: 2026-01-08*
*Autor: 01 - Ricardo (Refatorado)*
