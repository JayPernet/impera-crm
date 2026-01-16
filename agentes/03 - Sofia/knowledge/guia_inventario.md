# Guia de Inventário de Banco de Dados

## Princípio Fundamental
O `inventario_database.md` é o **artefato soberano** do projeto. Nenhuma arquitetura, design ou código pode ser gerado sem ele. É a Single Source of Truth.

## Estrutura Obrigatória

### 1. Cabeçalho do Inventário
```markdown
# Inventário de Banco de Dados - [Nome do Projeto]

**Versão:** 1.0.0
**Status:** [Em Desenvolvimento / Aprovado / Em Produção]
**Responsável:** Sofia (CTO)
**Última Atualização:** [Data]

---

## Ambiente e Configuração

### Ambiente Atual
- **Tipo:** [Local / Teste / Produção]
- **Provider:** [Supabase / PostgreSQL Local / Outro]
- **Database URL:** [URL do banco atual]

### Mapeamento de Migração
| Ambiente | Database URL | Notas |
|----------|--------------|-------|
| Local | postgresql://localhost:5432/[db_name] | Desenvolvimento local |
| Teste | [URL do Supabase Teste] | Branch de teste |
| Produção | [URL do Supabase Produção] | Database oficial |

**Instruções de Migração:**
1. [Passo a passo para migrar do local para teste]
2. [Passo a passo para migrar de teste para produção]
3. [Comandos específicos de migração]
```

### 2. Tabelas (Core Schema)
Para cada tabela, documente:

```markdown
## Tabela: `[nome_tabela]`

**Descrição:** [O que esta tabela armazena]
**Tipo:** [Core / Feature / Auxiliar]

### Colunas
| Nome | Tipo | Constraints | Default | Descrição |
|------|------|-------------|---------|-----------|
| id | bigint | PRIMARY KEY, AUTO INCREMENT | - | Identificador único |
| created_at | timestamptz | NOT NULL | now() | Data de criação |
| updated_at | timestamptz | NOT NULL | now() | Última atualização |
| [coluna] | [tipo] | [constraints] | [default] | [descrição] |

### Índices
| Nome | Colunas | Tipo | Justificativa |
|------|---------|------|---------------|
| idx_[nome]_[coluna] | [coluna] | btree | [Por que este índice é necessário] |

### Foreign Keys
| Coluna Local | Tabela Referenciada | Coluna Referenciada | On Delete | On Update |
|--------------|---------------------|---------------------|-----------|-----------|
| [fk_coluna] | [tabela] | id | CASCADE | CASCADE |

### RLS (Row Level Security)
**Status:** [Habilitado / Desabilitado]

**Políticas:**
1. **Nome:** `[nome_politica]`
   - **Tipo:** SELECT / INSERT / UPDATE / DELETE
   - **Usando:** `auth.uid() = user_id`
   - **Descrição:** [O que esta política protege]

2. **Nome:** `[nome_politica_2]`
   - **Tipo:** SELECT
   - **Usando:** `true` (público)
   - **Descrição:** [Justificativa para acesso público]

### Triggers
| Nome | Evento | Função | Descrição |
|------|--------|--------|-----------|
| [trigger_name] | BEFORE INSERT | [function_name] | [O que faz] |
```

### 3. Enums e Types Customizados
```markdown
## Enums

### `[enum_name]`
**Valores:** `['valor1', 'valor2', 'valor3']`
**Usado em:** `[tabela].[coluna]`
**Descrição:** [O que representa]
```

### 4. Funções e Stored Procedures
```markdown
## Funções

### `[function_name]()`
**Retorna:** [tipo de retorno]
**Descrição:** [O que faz]
**Usado por:** [Triggers / Aplicação / RLS]

**SQL:**
\`\`\`sql
CREATE OR REPLACE FUNCTION [function_name]()
RETURNS [tipo] AS $$
BEGIN
  -- [lógica]
END;
$$ LANGUAGE plpgsql;
\`\`\`
```

## Checklist de Validação

Antes de considerar o inventário completo, verifique:

- [ ] Todas as tabelas têm RLS habilitado (exceto se justificado)
- [ ] Todas as foreign keys têm índices
- [ ] Todos os tipos são apropriados para escala (bigint vs int)
- [ ] Todas as constraints estão documentadas
- [ ] O mapeamento de migração está completo
- [ ] As políticas RLS estão testadas
- [ ] Os triggers estão documentados
- [ ] Os enums estão definidos

## Estratégia de Migração

### Migração Local → Teste
1. Exportar schema: `pg_dump -s -h localhost -U [user] [db_name] > schema.sql`
2. Aplicar no Supabase Teste via SQL Editor
3. Verificar RLS policies
4. Testar queries críticas

### Migração Teste → Produção
1. **BACKUP OBRIGATÓRIO** do banco de produção
2. Aplicar migrations incrementais (não drop tables)
3. Verificar integridade referencial
4. Testar RLS em produção
5. Rollback plan: [descrever]

## Notas Importantes

- **Nunca** faça DROP TABLE em produção sem backup
- **Sempre** teste RLS policies antes de deploy
- **Documente** qualquer desvio do padrão
- **Versione** o inventário junto com o código
