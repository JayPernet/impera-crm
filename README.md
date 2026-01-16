```        _ _              ___          _          ___                  
 /\   /(_) |__   ___    / __\___   __| | ___    / __\ __ _____      __
 \ \ / / | '_ \ / _ \  / /  / _ \ / _` |/ _ \  / / | '__/ _ \ \ /\ / /
  \ V /| | |_) |  __/ / /__| (_) | (_| |  __/ / /__| | |  __/\ V  V / 
   \_/ |_|_.__/ \___| \____/\___/ \__,_|\___| \____/_|  \___| \_/\_/  
```

# Sobre o projeto

**Impera CRM: Luxury Real Estate Operating System**

O CRM onde sua imobiliária **Impera**. Sistema de gestão imobiliária de alta performance, focado em centralizar a operação do corretor em uma única tela. Diferencia-se pelo design "Cyber-Precision Luxury" e integração nativa com WhatsApp (sem gambiarras).

**Status:** Early Adopter Program (MVP)

## 🚀 Stack Tecnológica
- **Frontend:** Next.js 16 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 + Design Tokens (Globals.css)
- **Backend/Auth:** Supabase
- **Automação:** n8n (Webhooks)
- **UI:** Lucide React, Framer Motion

## 📂 Estrutura do Repositório
```
.
├── crm-web/          # Aplicação Principal (Next.js)
│   ├── src/app       # Rotas (Dashboard + Landing Page)
│   └── src/components # Componentes React
├── supabase/         # Configurações e Migrations de Banco
├── agentes/          # Crew de IA de desenvolvimento
└── docs/             # Documentação de Arquitetura e Produto
```

## 🛠️ Como Rodar Localmente

1. **Clone o repositório**
2. **Instale as dependências:**
   ```bash
   cd crm-web
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` em `crm-web/` com as chaves do Supabase e Webhooks.
4. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000`.

## 🎨 Design System
O projeto utiliza um sistema de tokens CSS rigoroso para garantir a consistência visual "Luxury".
- Cores Primárias: Abyss (Background), Gold (Accent).
- Fontes: Geist Sans (UI), JetBrains Mono (Code/Numbers).
