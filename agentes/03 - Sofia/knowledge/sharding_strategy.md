# Estratégia de Sharding de Documentação

> **TL;DR:** Documentos grandes e monolíticos são um problema. Nós os quebramos (fazemos "sharding") em arquivos menores e conectados, por domínio de negócio, para que sejam mais fáceis de manter por humanos e para que as IAs consigam processá-los eficientemente.

---

## 1. O Problema: O Monólito da Documentação
*Por que não podemos ter um único arquivo gigante com toda a documentação?*

Manter toda a documentação de um sistema em um único arquivo (um "monólito") é insustentável e leva a problemas graves:

- **Sobrecarga Cognitiva:** Fica extremamente difícil para humanos encontrarem, entenderem e atualizarem a informação que precisam. A navegação se torna um pesadelo.
- **Limites de Contexto (LLMs):** Agentes de IA, como os da nossa equipe, têm um limite de quanto texto conseguem "ler" de uma vez (a "janela de contexto"). Arquivos enormes excedem esse limite, tornando a IA ineficaz para analisar, modificar ou consultar a documentação.
- **Conflitos e Ownership:** Aumenta a chance de conflitos de versionamento no Git, pois várias pessoas podem precisar editar o mesmo arquivo. Fica difícil definir quem é o "dono" de cada parte da documentação.

## 2. Os Princípios do Sharding
*Nossas regras de ouro para dividir a documentação de forma inteligente.*

- **Princípio da Alta Coesão:** Cada "shard" (fragmento/arquivo) deve conter informações fortemente relacionadas entre si. Agrupe o que pertence ao mesmo contexto de negócio. Se um desenvolvedor precisa resolver uma tarefa sobre "Pagamentos", ele deveria encontrar 90% do que precisa em um único shard de "Pagamentos".
- **Princípio do Baixo Acoplamento:** As dependências entre os shards devem ser mínimas e explícitas. Evite criar uma teia de aranha onde um shard não pode ser entendido sem ler outros cinco.
- **Princípio do Ponto de Entrada Único:** Cada conjunto de shards de um mesmo tipo (ex: inventário de banco de dados, documentação de API) deve ter um arquivo `_master.md` que serve como o índice e mapa principal, direcionando para os shards filhos.

## 3. Guia Prático de Sharding

### Passo 1: Identificar Candidatos ao Sharding
*Quando devo pensar em quebrar um documento?*

- **Heurística do Tamanho:** O arquivo tem mais de 500 linhas ou 100kb? Este é um forte sinal.
- **Heurística do Domínio:** O arquivo descreve mais de um domínio de negócio claro (ex: Autenticação, Pagamentos, Notificações)?
- **Heurística da Propriedade (Ownership):** Diferentes partes do arquivo são, na prática, mantidas por times ou pessoas diferentes?

### Passo 2: Escolher a Estratégia de Divisão
*Qual o melhor critério para "fatiar o bolo"?*

- **Por Domínio de Negócio (Recomendado):** `auth_docs.md`, `payments_docs.md`, `shipping_docs.md`. Esta é a forma mais robusta e alinhada à arquitetura de software moderna (Domain-Driven Design).
- **Por Tipo de Artefato (Usado dentro de um domínio):** `payments_api.md`, `payments_database.md`. Esta divisão pode ser útil, mas geralmente deve estar subordinada à divisão por domínio.

### Passo 3: Implementar o Padrão Master-Slave
1. **Crie o Arquivo Master (`[tipo]_master.md`):** Este arquivo **não** contém a documentação detalhada. Ele é o mapa e deve conter:
    - Uma visão geral da arquitetura.
    - O índice com links para todos os shards filhos.
    - A documentação de como os shards se conectam (relações-chave, contratos de API, eventos disparados).
2. **Crie os Shards Filhos (`[tipo]_[contexto].md`):** Mova o conteúdo detalhado do antigo monolito para os novos shards.
3. **Documente as Conexões:** Se o shard `A` depende de `B`, essa dependência deve ser claramente anotada em `A` e, obrigatoriamente, no arquivo `master`.

## 4. Caso de Estudo: Sharding do `inventario_database.md`

O padrão a ser seguido para o inventário do banco de dados é:

1. **`inventario_database_master.md`:**
    - Contém o Diagrama de Entidade e Relacionamento (DER) de alto nível, mostrando apenas os relacionamentos principais entre os grandes domínios.
    - Lista todos os shards e o domínio que cada um cobre.
    - Documenta **explicitamente** as chaves estrangeiras que conectam tabelas em shards diferentes.

2. **`inventario_database_core.md`:**
    - Contém as tabelas centrais do sistema, que são usadas por quase todos os outros domínios.
    - Ex: `users`, `tenants`, `roles`, `permissions`.

3. **`inventario_database_[dominio].md`:**
    - Contém as tabelas específicas de um domínio de negócio.
    - Exemplo: `inventario_database_marketplace.md` conteria tabelas como `products`, `orders`, `reviews`.
    - Exemplo: `inventario_database_payments.md` conteria tabelas como `invoices`, `transactions`, `payment_methods`.

## 5. Boas Práticas e Anti-Padrões

### Boas Práticas (Faça isso 👍)
- **Nomenclatura Clara:** Use um padrão consistente como `[artefato]_[domínio/contexto].md`.
- **Links Bidirecionais:** Sempre que possível, se o shard A linka para o B, o B deveria ter um link de volta para o A ou para o `master`.
- **Review de Sharding:** Trate a decisão de criar ou modificar shards como uma decisão de arquitetura, discutida com o time.

### Anti-Padrões (Não faça isso 👎)
- **Shards Anêmicos:** Arquivos com tão pouco conteúdo que poderiam estar agrupados com outros. A granularidade excessiva atrapalha.
- **Acoplamento Circular:** O Shard A depende do B, e o B depende do A. Isso é um sinal de que a fronteira entre os domínios foi definida incorretamente.
- **Índice Desatualizado:** O arquivo `master` não reflete a realidade dos shards, tornando a navegação impossível e enganando tanto humanos quanto IAs. É o pior dos anti-padrões.
