# User Story: [Nome da Story]

- **ID:** `US-XXX`
- **Épico Pai:** `[Link para o Épico]`
- **Prioridade:** `[Must Have | Should Have | Could Have]`
- **Estimativa (Story Points):** `[Ex: 3, 5, 8]`
- **Status:** `[A Fazer | Em Refinamento | Pronto para Dev | Em Dev | Em QA | Concluído]`

---

## 1. Descrição (O Porquê)

**Como um** [Tipo de Usuário],
**Eu quero** [Realizar uma Ação],
**Para que** [Eu Obtenha um Benefício/Valor].

### Justificativa / Problema a Resolver:
*(Opcional, mas recomendado) Descreva brevemente a dor do usuário ou a necessidade que esta story resolve. Isso ajuda a manter o time focado no valor, não apenas na feature.*
*(Ex: Atualmente, o usuário não tem como recuperar sua senha de forma autônoma, gerando frustração e tickets de suporte. Esta story resolve esse problema.)*

## 2. Requisitos Visuais e de Experiência (UX/UI)
*Nenhuma linha de código deve ser escrita antes da compreensão da interface. Links diretos para os componentes/telas relevantes.*

- **Protótipo / Tela(s) no Figma:** `[Link direto para a(s) tela(s) ou componente(s) específico(s)]`
- **Notas de UX:** 
  - *(Ex: A animação do botão deve ser suave, com 0.3s de ease-in-out.)*
  - *(Ex: O feedback de erro deve aparecer abaixo do campo, em vermelho #D9534F.)*

## 3. Critérios de Aceitação (A Definição de "Pronto")
*A lista definitiva de regras que a implementação deve seguir. Use o formato Gherkin para clareza. Cada critério deve ser testável.*

### Cenário 1: [Nome do Cenário - Ex: Caminho Feliz - E-mail válido]
- **Dado que** eu estou na página "Esqueci minha senha"
- **Quando** eu insiro um e-mail de uma conta existente e clico em "Recuperar Senha"
- **Então** eu devo ver uma mensagem de sucesso confirmando que um e-mail foi enviado
- **E** um e-mail contendo um link para redefinição de senha deve ser enviado para o endereço fornecido.

### Cenário 2: [Nome do Cenário - Ex: Caso de Erro - E-mail inválido/inexistente]
- **Dado que** eu estou na página "Esqueci minha senha"
- **Quando** eu insiro um e-mail que não está cadastrado no sistema
- **Então** eu devo ver a mesma mensagem de sucesso do cenário 1. 
*(Nota: Por segurança, não informamos ao usuário se o e-mail existe ou não na nossa base)*

### Cenário 3: [Nome do Cenário - Ex: Validação de Campo - E-mail mal formatado]
- **Dado que** eu estou na página "Esqueci minha senha"
- **Quando** eu digito um texto que não é um e-mail válido (ex: "teste")
- **E** saio do campo de e-mail
- **Então** eu devo ver uma mensagem de erro de validação abaixo do campo, como "Por favor, insira um e-mail válido".

## 4. Notas de Implementação (Input para Devs / Sofia)
*Detalhes técnicos, sugestões de abordagem ou perguntas que precisam ser respondidas.*

- **Abordagem Sugerida:** `(Ex: Gerar um token JWT de uso único com expiração de 1 hora para o link de redefinição.)`
- **APIs / Endpoints a serem usados/criados:** `(Ex: `POST /api/v1/auth/forgot-password`)`
- **Variáveis de Ambiente:** `(Ex: Necessário configurar o serviço de envio de e-mails, como SendGrid/SES, e suas respectivas chaves de API.)`
- **Dependências:** `(Ex: Esta story depende do template de e-mail de redefinição de senha ser criado - tarefa US-456)`

## 5. Estratégia de Testes (Input para QA / Paulo)
*Como garantiremos a qualidade desta entrega? O que precisa ser verificado?*

- **Plano de Teste:** `[Link para o Test Plan ou casos de teste formais, se aplicável]`
- **Casos de Teste a Cobrir:**
    - `[ ]` Teste funcional (seguir todos os ACs).
    - `[ ]` Teste do e-mail (verificar se o e-mail chega, se o link funciona e se expira corretamente).
    - `[ ]` Teste de segurança (tentar usar o mesmo link de redefinição duas vezes).
    - `[ ]` Teste de regressão visual (comparar com o Figma nos principais viewports).
- **Ambientes/Dispositivos:** `(Ex: Testar nos navegadores Chrome e Safari. Validar o recebimento do e-mail no Gmail e Outlook.)`