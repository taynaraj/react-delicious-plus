# Delicious+ Backend API

API REST construída com Node.js, Express, TypeScript, Prisma e PostgreSQL.

---

## 🚀 Tecnologias

- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de schemas
- **bcryptjs** - Hash de senhas

---

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/delicious_plus?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

### 3. Configurar Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

---

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

Servidor em `http://localhost:3001`

### Produção

```bash
npm run build
npm start
```

---

## 📁 Estrutura

```
back/
├── src/
│   ├── server.ts              # Entry point
│   ├── config/                # Configurações
│   ├── modules/               # Módulos da aplicação
│   │   ├── auth/
│   │   ├── users/
│   │   ├── bookmarks/
│   │   ├── collections/
│   │   ├── tags/
│   │   └── upload/
│   ├── middlewares/           # Middlewares (auth, errorHandler)
│   └── shared/                # Código compartilhado
├── prisma/
│   └── schema.prisma          # Schema do banco
└── dist/                      # Build (gerado)
```

---

## 🔌 API Endpoints

Todas as rotas prefixadas com `/api`:

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Bookmarks
- `GET /api/bookmarks` - Listar
- `GET /api/bookmarks/:id` - Obter por ID
- `POST /api/bookmarks` - Criar
- `PATCH /api/bookmarks/:id` - Atualizar
- `DELETE /api/bookmarks/:id` - Deletar

### Collections
- `GET /api/collections` - Listar
- `GET /api/collections/:id` - Obter por ID
- `POST /api/collections` - Criar
- `PATCH /api/collections/:id` - Atualizar
- `DELETE /api/collections/:id` - Deletar

### Tags
- `GET /api/tags` - Listar
- `GET /api/tags/:id` - Obter por ID
- `POST /api/tags` - Criar
- `PATCH /api/tags/:id` - Atualizar
- `DELETE /api/tags/:id` - Deletar

### Upload
- `POST /api/upload/image` - Upload de imagem

### Health Check
- `GET /health` - Status do servidor

---

## 🔒 Autenticação

Rotas protegidas requerem token JWT:

```
Authorization: Bearer <token>
```

O middleware `authMiddleware` valida o token e adiciona `userId` e `user` ao `req`.

---

## 🐛 Troubleshooting

### Erro de conexão PostgreSQL

- Verificar se PostgreSQL está rodando
- Validar credenciais no `.env`
- Confirmar que o banco existe

### Erro nas migrations

- Executar `npm run prisma:generate`
- Verificar acesso ao banco
- Confirmar variáveis de ambiente

---

## 📋 Scripts Disponíveis

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Executar em produção
- `npm run prisma:generate` - Gerar Prisma Client
- `npm run prisma:migrate` - Executar migrations
- `npm run prisma:studio` - Abrir Prisma Studio
