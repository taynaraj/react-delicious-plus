# Delicious+ Backend API

Backend API para o Delicious+ construído com Node.js, Express, TypeScript, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Zod** - Validação de schemas
- **bcryptjs** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/delicious_plus?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

**Importante:**
- Substitua `user`, `password` e `delicious_plus` pelos seus dados do PostgreSQL
- Gere uma `JWT_SECRET` forte e única para produção
- Ajuste `CORS_ORIGIN` para a URL do seu frontend

### 3. Configurar Prisma

#### Gerar o cliente Prisma:

```bash
npm run prisma:generate
```

#### Criar o banco de dados e executar migrations:

```bash
npm run prisma:migrate
```

Este comando irá:
- Criar o banco de dados (se não existir)
- Executar todas as migrations
- Gerar o Prisma Client

#### (Opcional) Abrir Prisma Studio para visualizar dados:

```bash
npm run prisma:studio
```

## 🏃 Executar

### Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Build para produção:

```bash
npm run build
```

### Executar em produção:

```bash
npm start
```

## 📁 Estrutura do Projeto

```
back/
├── src/
│   ├── server.ts              # Entry point do servidor
│   ├── config/
│   │   └── env.ts             # Configuração de variáveis de ambiente
│   ├── prisma/
│   │   └── schema.prisma      # Schema do Prisma
│   ├── modules/
│   │   ├── auth/              # Módulo de autenticação
│   │   │   └── routes.ts
│   │   ├── users/             # Módulo de usuários
│   │   │   └── routes.ts
│   │   ├── bookmarks/         # Módulo de bookmarks
│   │   │   └── routes.ts
│   │   ├── collections/       # Módulo de coleções
│   │   │   └── routes.ts
│   │   ├── tags/              # Módulo de tags
│   │   │   └── routes.ts
│   │   └── upload/            # Módulo de upload
│   │       └── routes.ts
│   └── middlewares/
│       └── auth.ts            # Middleware de autenticação
├── dist/                      # Build compilado (gerado)
├── .env                       # Variáveis de ambiente (não commitado)
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Rotas Disponíveis

Todas as rotas estão prefixadas com `/api`:

### Autenticação (públicas)
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obter usuário atual

### Usuários (protegidas)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Bookmarks (protegidas)
- `GET /api/bookmarks` - Listar bookmarks
- `GET /api/bookmarks/:id` - Obter bookmark por ID
- `POST /api/bookmarks` - Criar bookmark
- `PUT /api/bookmarks/:id` - Atualizar bookmark
- `DELETE /api/bookmarks/:id` - Deletar bookmark

### Collections (protegidas)
- `GET /api/collections` - Listar coleções
- `GET /api/collections/:id` - Obter coleção por ID
- `POST /api/collections` - Criar coleção
- `PUT /api/collections/:id` - Atualizar coleção
- `DELETE /api/collections/:id` - Deletar coleção

### Tags (protegidas)
- `GET /api/tags` - Listar tags
- `GET /api/tags/:id` - Obter tag por ID
- `POST /api/tags` - Criar tag
- `PUT /api/tags/:id` - Atualizar tag
- `DELETE /api/tags/:id` - Deletar tag

### Upload (protegidas)
- `POST /api/upload/image` - Upload de imagem
- `POST /api/upload/file` - Upload de arquivo

### Health Check
- `GET /health` - Verificar status do servidor

## 🔒 Autenticação

As rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer <token>
```

O middleware `authMiddleware` valida o token e adiciona `userId` e `user` ao objeto `req`.

## 📝 Próximos Passos

1. Implementar lógica de autenticação (register, login, logout)
2. Implementar CRUD completo para cada módulo
3. Adicionar validação de dados com Zod
4. Implementar upload de arquivos
5. Adicionar tratamento de erros robusto
6. Adicionar testes unitários e de integração
7. Adicionar documentação com Swagger/OpenAPI

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL

Verifique se:
- PostgreSQL está rodando
- As credenciais no `.env` estão corretas
- O banco de dados existe

### Erro ao executar migrations

Certifique-se de que:
- O Prisma Client foi gerado (`npm run prisma:generate`)
- O banco de dados está acessível
- As variáveis de ambiente estão configuradas corretamente

## 📄 Licença

ISC

