# Princípios de Arquitetura Para Vibe Coding

## Etapa 1

### Planning

Listar as features usando o formato "Users should be able to..." para mapear tudo que meu app precisa fazer. Exemplo (vou usar um app de delivery para ficar mais fácil de você entender):

- Users should be able to criar uma conta e fazer login como restaurante ou usuário
- Users should be able to ver o cardápio de restaurantes próximos
- Users (restaurantes) should be able to adicionar pratos no menu
- Users should be able to adicionar itens ao carrinho
- Users should be able to finalizar o pedido e fazer pagamento
- Users should be able to acompanhar o status da entrega em tempo real
- Users should be able to ver o histórico de pedidos anteriores
E por aí vai...

### Identificação de dependências e priorização

Depois de listar as principais features, temos que identificar quais são as dependências entre as features, ou seja: qual feature precisa ficar pronta para que outra feature possa ser implementada?

Por exemplo, pensando em um app de delivery:
- A funcionalidade de criação de conta/ login seria a primeira de todas (pois todas as outras funcionalidades dependem de você estar logado)
- A funcionalidade de permitir que restaurantes adicionem pratos ao menu precisa vir antes da funcionalidade que permite que usuários vejam o menu do restaurante.
E por aí vai...

## Etapa 2

### D.R.Y (Don't Repeat Yourself)

Imagine o seguinte exemplo: você tem quatro botões na página, e, em cada um deles, você declarou que a variável de cor era azul (quatro vezes). Em um dado momento, decidimos mudar de azul para verde. E assim, você vai ter que substituir essa variável quatro vezes ao invés de uma vez só (caótico).

Como seria mais inteligente fazer isso: criar uma variável de cor separada, e fazer os seus quatro botões importarem aquela variável do mesmo lugar. Assim, você só precisa trocar essa variável uma vez. É uma maneira muito mais modular e inteligente de fazer isso e eu cuidadosamente.

Isso é uma referência direta ao que inserir no `design_system.json` pois a modularidade se complementa.

## Etapa 3

### K.I.S.S (Keep It Simple, Stupid)

Temos um **inimigo** na nossa metodologia de desenvolvimento, além da pressa: overengineer.
Sabemos que existem inúmeras maneiras de se chegar no mesmo resultado e **indiscutivelmente**, a mais simples é a melhor. Você pode fazer uma implementação com 1.500 linhas e chegar exatamente no mesmo resultado com 150 linhas.

Não faça o mais complexo para resolver o mais simples. Na dúvida, keep it simple, stupid! >.<

### Y.A.G.N.I (You Aren't Gonna Need It)

Proatividade é bom, até o momento que você tenta ser um vidente e prever o futuro.
"Ah se no futuro eu quiser adicionar um sistema de notificações por email, que seria bom criar a estrutura agora..." NÃO! Quando (e SE) precisar daquele recurso, aí sim ele será adicionado.

Implementar coisas 'just in case' é arriscado porque **sempre** acontece de implementar coisas que ainda não foram pensadas muito bem a respeito (não há Epic, não há Story, não há PRP....). E coisas mal planejadas **sempre** acabam aumentando o risco de alguma coisa quebrar.

## Etapa 4

### Feature-Based Folder Structure

Ao invés de organizar seu código por TIPO de arquivo (Exemplo: pasta com todos os componentes, pasta com todos os hooks, pasta com todos os serviços, etc), devemos **organizar por FEATURE** (exemplo: pasta com todos os arquivos da feature de autenticação, pasta com todos os arquivos da feature de billing, e por aí vai).

#### Não fazer:
```
/components
  - LoginForm.tsx
  - Dashboard.tsx
  - PaymentForm.tsx
/hooks
  - useAuth.ts
  - useBilling.ts
/services
  - stripe.ts
  - auth.ts
  - open-ai.ts
```

#### Fazer:
```
/auth
   /components
     - LoginForm.tsx
   /hooks
     - useAuth.ts
   /services
     - auth.ts
/billing
   /components
      - PaymentForm.tsx
   /hooks
     - useBilling.ts
   /services
     - stripe.ts
```

Por que fazer isso?
Vamos supor que há um problema na feature de billing.
Na organização por tipo de arquivo (a não recomendada), teríamos que ler TODOS os componentes, TODOS os hooks, TODOS os serviços para encontrar aqueles que pertencem à feature de billing. Exemplo: 220 arquivos. 

Na organização por feature (a recomendada), é só achar a pasta com o nome da feature e ler só os arquivos que pertencem àquela feature. Exemplo: 12 arquivos.

### Separation of Concerns

Apesar de ser mais prático colocar todas as coisas juntas em um mesmo arquivo, isso não é a coisa mais inteligente a se fazer e eu vou te explicar porque.

Exemplo para ilustrar: Imagine que você está fazendo uma integração com a API do Resend para enviar emails automáticos a partir da sua aplicação, e fez um arquivo de 1.200 linhas chamado "resend-integration.ts", contendo:
- Um template de email
- A integração com a API do resend para enviar o email
- As regras de 'trigger' para enviar o email, depois que o usuário cria uma conta

Por que isso não é bom? Porque **cada parte do seu código deve cuidar de UMA coisa só**. E esse arquivo tem três responsabilidades distintas dentro dele. Misturar responsabilidades dentro de um arquivo dificulta muito a manutenção/ extensão. 

Uma regra é pensar **"quando eu mudar uma parte do código, a outra parte será afetada também?"**. Se sim, mantenha elas juntas. Se não, separe.

Como ficaria o exemplo anterior, se feito da maneira correta:
- email-template.ts: Um arquivo para o template do email (criando outros arquivos de template de email, conforme necessidade)
- resend.ts: Um arquivo para a integração com a API do Resend
- signup.ts: O trigger dentro do fluxo de criação de conta, que chama a integração do resend quando a conta do usuário for criada (podendo ter outros triggers que chamam/ compartilham essa mesma integração).

Por que isso é melhor? Eu vou citar 5, mas existem muitos outros motivos:
- Mais fácil de encontrar bugs: Problema no template do email? Apenas olha o arquivo de template do email.
- Mais fácil de manter: Quer mudar a configuração? Só mexe no arquivo de configuração.
- Mais fácil de reutilizar: Pode usar a mesma integração em outros lugares
- Mais fácil de entender: Cada arquivo tem um propósito claro
- Mais fácil de escalar: Adicionar novas features não vira bagunça

## Conclusão

Eu sei que no início pode parecer trabalhoso seguir todos esses princípios. O comportamento comum é iniciar e finalizar logo, eu entendo.

Mas esses minutos investindo em planejamento e organização vão economizar HORAS (às vezes DIAS e até SEMANAS) de trabalho depois.

Portanto, lembre-se de inserir esses princípios no workflow:
- Planning claro antes de começar
- Código reutilizável (D.R.Y)
- Soluções simples (K.I.S.S)
- Apenas o necessário (Y.A.G.N.I)
- Organização por features
- Separação de responsabilidades
