# API — Pensão da Vivi

Backend em **Next.js API Routes** + **SQLite** (`data/pensaovivi.db`).

Pedidos/carrinho ficam **somente no localStorage** do navegador (não vão pro banco).

## Autenticação (admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login `{ email, password }` |
| POST | `/api/auth/logout` | Encerrar sessão |
| GET | `/api/auth/me` | Usuário logado |

Credenciais padrão: ver `.env.example`

## Categorias

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categories` | Lista tipos de prato |

## Produtos (pratos)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/products` | Não | Lista pratos **ativos** (cardápio público) |
| GET | `/api/products?category=refeicoes` | Não | Filtra por categoria |
| GET | `/api/products?all=true` | Sim | Lista todos (inclui escondidos) |
| GET | `/api/products?all=true&category=bebidas` | Sim | Admin filtrado |
| POST | `/api/products` | Sim | Criar prato |
| GET | `/api/products/:id` | Não | Buscar um prato |
| PUT | `/api/products/:id` | Sim | Editar / ativar / esconder |
| DELETE | `/api/products/:id` | Sim | Excluir permanentemente |

### Body criar/editar prato

```json
{
  "categoryId": "refeicoes",
  "name": "Prato Feito",
  "description": "Arroz, feijão, bife e salada",
  "price": 24.9,
  "active": true
}
```

Categorias: `refeicoes` | `batatas` | `bebidas` | `sobremesas`

## Pedidos (localStorage — sem API)

| Chave | Conteúdo |
|-------|----------|
| `pensaovivi_cart` | Itens do carrinho |
| `pensaovivi_checkout` | Dados do formulário (nome, pagamento, etc.) |

Ao finalizar, o app monta a mensagem e abre o WhatsApp. Nada é salvo no servidor.
