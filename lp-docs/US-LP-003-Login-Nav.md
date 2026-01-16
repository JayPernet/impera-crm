# User Story: Navegação e Login (Portal Acess)

- **ID:** `US-LP-003`
- **Épico Pai:** `[EPC-LP-03 - Conversão e Acesso](./prd_landing_page.md)`
- **Prioridade:** `Must Have`
- **Estimativa (Story Points):** `3`
- **Status:** `A Fazer`

---

## 1. Descrição (O Porquê)

**Como um** cliente atual do CRM,
**Eu quero** encontrar facilmente um botão de "Entrar" ou "Login" na Landing Page,
**Para que** eu possa acessar minha dashboard para trabalhar.

### Justificativa:
Como ainda não temos cadastro automático (Self-Service), a LP servirá também como ponto de acesso para os clientes atuais. O fluxo deve ser sem atrito.

## 2. Requisitos Visuais

- **Header (Navbar):** Fixo no topo (sticky) ou visível na primeira dobra.
- **Botão de Login:** Deve se destacar visualmente, mas diferenciar-se do CTA de "Agendar Demo". Geralmente localizado no canto superior direito.
- **Estilo:** Botão "Outline" ou link com ícone de usuário.

## 3. Critérios de Aceitação

### Cenário 1: Clique em Login
- **Dado que** estou na Landing Page
- **Quando** clico no botão "Login" no header
- **Então** devo ser redirecionado para a rota `/login` (ou a URL da aplicação CRM existente).
- **E** o redirecionamento deve ser na mesma aba (self) ou nova aba (blank) - *Definir: Mesma aba padrão*.

### Cenário 2: Login no Mobile
- **Dado que** estou no celular com o menu "hambúrguer" colapsado
- **Quando** abro o menu
- **Então** o link de "Login" deve estar visível e acessível.

## 4. Notas de Implementação

- O link deve apontar para a rota de login já existente no projeto Next.js (ex: `/auth/login` ou `/portal`).
- Garantir que o botão tenha `aria-label="Acessar minha conta"`.
