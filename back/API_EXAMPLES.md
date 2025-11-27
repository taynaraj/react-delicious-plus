# Delicious+ API - Exemplos de Requisições

Documentação com exemplos de requisições para todas as rotas da API.

## 🔑 Autenticação

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <token>
```

---

## 📝 AUTH

### 1. Registrar Usuário

**POST** `/api/auth/register`

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "jwt-token-here"
}
```

### 2. Login

**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "jwt-token-here"
}
```

### 3. Obter Usuário Atual

**GET** `/api/auth/me`

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 👤 USERS

### 1. Obter Perfil

**GET** `/api/users/me`

```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Atualizar Perfil

**PATCH** `/api/users/me`

```bash
curl -X PATCH http://localhost:3001/api/users/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos"
  }'
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva Santos",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔖 BOOKMARKS

### 1. Listar Bookmarks

**GET** `/api/bookmarks`

**Query Parameters:**
- `search` - Buscar por título, descrição ou URL
- `tag` - Filtrar por tag
- `collectionId` - Filtrar por coleção
- `isFavorite` - Filtrar favoritos (true/false)
- `isRead` - Filtrar lidos (true/false)
- `limit` - Limite de resultados (padrão: 20)
- `offset` - Offset para paginação (padrão: 0)

```bash
# Listar todos
curl -X GET "http://localhost:3001/api/bookmarks" \
  -H "Authorization: Bearer <token>"

# Com filtros
curl -X GET "http://localhost:3001/api/bookmarks?search=react&isFavorite=true&limit=10&offset=0" \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "React Documentation",
      "url": "https://react.dev",
      "description": "Official React docs",
      "image": null,
      "favorite": true,
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "tags": [
        {
          "id": "uuid",
          "name": "react",
          "color": null
        }
      ],
      "collection": {
        "id": "uuid",
        "name": "Frontend",
        "emoji": "⚛️"
      }
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### 2. Obter Bookmark por ID

**GET** `/api/bookmarks/:id`

```bash
curl -X GET http://localhost:3001/api/bookmarks/<bookmark-id> \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "bookmark": {
    "id": "uuid",
    "title": "React Documentation",
    "url": "https://react.dev",
    "description": "Official React docs",
    "image": null,
    "favorite": true,
    "read": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "tags": [],
    "collection": null
  }
}
```

### 3. Criar Bookmark

**POST** `/api/bookmarks`

```bash
curl -X POST http://localhost:3001/api/bookmarks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Documentation",
    "url": "https://react.dev",
    "description": "Official React documentation",
    "tags": ["react", "frontend"],
    "collectionId": "uuid-optional",
    "favorite": true,
    "read": false
  }'
```

**Resposta:**
```json
{
  "bookmark": {
    "id": "uuid",
    "title": "React Documentation",
    "url": "https://react.dev",
    "description": "Official React documentation",
    "image": null,
    "favorite": true,
    "read": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "tags": [
      {
        "id": "uuid",
        "name": "react",
        "color": null
      },
      {
        "id": "uuid",
        "name": "frontend",
        "color": null
      }
    ],
    "collection": null
  }
}
```

### 4. Atualizar Bookmark

**PATCH** `/api/bookmarks/:id`

```bash
curl -X PATCH http://localhost:3001/api/bookmarks/<bookmark-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Documentation Updated",
    "favorite": false
  }'
```

**Resposta:**
```json
{
  "bookmark": {
    "id": "uuid",
    "title": "React Documentation Updated",
    "url": "https://react.dev",
    "description": "Official React documentation",
    "favorite": false,
    "read": false,
    ...
  }
}
```

### 5. Deletar Bookmark

**DELETE** `/api/bookmarks/:id`

```bash
curl -X DELETE http://localhost:3001/api/bookmarks/<bookmark-id> \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "message": "Bookmark deleted successfully"
}
```

---

## 📁 COLLECTIONS

### 1. Listar Coleções

**GET** `/api/collections`

```bash
curl -X GET http://localhost:3001/api/collections \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "collections": [
    {
      "id": "uuid",
      "name": "Frontend",
      "emoji": "⚛️",
      "description": "Frontend resources",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "bookmarks": 5
      }
    }
  ]
}
```

### 2. Obter Coleção por ID

**GET** `/api/collections/:id`

```bash
curl -X GET http://localhost:3001/api/collections/<collection-id> \
  -H "Authorization: Bearer <token>"
```

### 3. Criar Coleção

**POST** `/api/collections`

```bash
curl -X POST http://localhost:3001/api/collections \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend",
    "emoji": "⚛️",
    "description": "Frontend resources"
  }'
```

**Resposta:**
```json
{
  "collection": {
    "id": "uuid",
    "name": "Frontend",
    "emoji": "⚛️",
    "description": "Frontend resources",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Atualizar Coleção

**PATCH** `/api/collections/:id`

```bash
curl -X PATCH http://localhost:3001/api/collections/<collection-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Updated",
    "emoji": "🎨"
  }'
```

### 5. Deletar Coleção

**DELETE** `/api/collections/:id`

```bash
curl -X DELETE http://localhost:3001/api/collections/<collection-id> \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "message": "Collection deleted successfully"
}
```

---

## 🏷️ TAGS

### 1. Listar Tags

**GET** `/api/tags`

```bash
curl -X GET http://localhost:3001/api/tags \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "tags": [
    {
      "id": "uuid",
      "name": "react",
      "color": "#61DAFB",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "bookmarks": 10
      }
    }
  ]
}
```

### 2. Obter Tag por ID

**GET** `/api/tags/:id`

```bash
curl -X GET http://localhost:3001/api/tags/<tag-id> \
  -H "Authorization: Bearer <token>"
```

### 3. Criar Tag

**POST** `/api/tags`

```bash
curl -X POST http://localhost:3001/api/tags \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "react",
    "color": "#61DAFB"
  }'
```

**Resposta:**
```json
{
  "tag": {
    "id": "uuid",
    "name": "react",
    "color": "#61DAFB",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Atualizar Tag

**PATCH** `/api/tags/:id`

```bash
curl -X PATCH http://localhost:3001/api/tags/<tag-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "#000000"
  }'
```

### 5. Deletar Tag

**DELETE** `/api/tags/:id`

```bash
curl -X DELETE http://localhost:3001/api/tags/<tag-id> \
  -H "Authorization: Bearer <token>"
```

**Resposta:**
```json
{
  "message": "Tag deleted successfully"
}
```

---

## 📤 UPLOAD

### 1. Upload de Imagem

**POST** `/api/upload/image`

**Content-Type:** `multipart/form-data`

**Limites:**
- Tipos permitidos: PNG, JPG, JPEG, WEBP
- Tamanho máximo: 2MB

```bash
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.png"
```

**Resposta:**
```json
{
  "url": "/uploads/image-1234567890-123456789.png"
}
```

**Acesso à imagem:**
```
http://localhost:3001/uploads/image-1234567890-123456789.png
```

---

## 📋 POSTMAN/INSOMNIA

### Collection JSON para Postman

```json
{
  "info": {
    "name": "Delicious+ API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao@example.com\",\n  \"password\": \"senha123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"joao@example.com\",\n  \"password\": \"senha123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{baseUrl}}/api/auth/me",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Bookmarks",
      "item": [
        {
          "name": "List Bookmarks",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{baseUrl}}/api/bookmarks?limit=20&offset=0",
              "host": ["{{baseUrl}}"],
              "path": ["api", "bookmarks"],
              "query": [
                {"key": "limit", "value": "20"},
                {"key": "offset", "value": "0"}
              ]
            }
          }
        },
        {
          "name": "Create Bookmark",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"},
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"React Documentation\",\n  \"url\": \"https://react.dev\",\n  \"description\": \"Official React docs\",\n  \"tags\": [\"react\", \"frontend\"]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/bookmarks",
              "host": ["{{baseUrl}}"],
              "path": ["api", "bookmarks"]
            }
          }
        }
      ]
    }
  ]
}
```

### Insomnia

1. Crie uma nova workspace
2. Adicione variáveis de ambiente:
   - `baseUrl`: `http://localhost:3001`
   - `token`: (será preenchido após login)
3. Importe as requisições seguindo o padrão acima

---

## ⚠️ Códigos de Erro

- `400` - Bad Request (validação falhou)
- `401` - Unauthorized (token inválido ou ausente)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (duplicado)
- `500` - Internal Server Error

**Formato de erro:**
```json
{
  "error": "Mensagem de erro descritiva"
}
```

