# Delicious+ Frontend

Frontend React do Delicious+ integrado com backend Node.js/Express.

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Router** - Roteamento

## 📋 Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3001` (ou configurar `VITE_API_URL`)

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar URL da API

Crie um arquivo `.env` na raiz do projeto `front/`:

```env
VITE_API_URL=http://localhost:3001
```

**Importante:** Se o backend estiver em outra porta ou URL, ajuste o valor acima.

### 3. Rodar o backend

Antes de rodar o frontend, certifique-se de que o backend está rodando:

```bash
# Na pasta back/
cd ../back
npm install
npm run dev
```

O backend deve estar rodando em `http://localhost:3001`.

### 4. Rodar o frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada).

## 🔄 Fluxo de Integração

### 1. Registrar Usuário

1. Acesse `/register`
2. Preencha nome, email e senha
3. Ao registrar, o usuário é automaticamente logado
4. O token JWT é salvo em `localStorage` como `react-delicious-token`

### 2. Login

1. Acesse `/login`
2. Informe email e senha
3. O token JWT é salvo automaticamente

### 3. Criar Bookmark

1. Após logado, acesse a HomePage
2. Clique em "Adicionar" ou navegue para `/bookmarks/new`
3. Preencha título e URL (obrigatórios)
4. Opcionalmente:
   - Adicione descrição
   - Selecione tags (ou crie novas)
   - Selecione uma coleção
   - Faça upload de uma imagem (thumbnail customizada)
5. Ao salvar, o bookmark é criado na API

### 4. Listar Bookmarks

- Os bookmarks são carregados automaticamente ao acessar a HomePage
- Use a busca para filtrar por título, URL ou descrição
- Use os filtros para:
  - Favoritos
  - Lidos/Não lidos
  - Por tag
  - Por coleção

## 📁 Estrutura do Projeto

```
front/
├── src/
│   ├── app/              # Configuração da aplicação
│   │   ├── providers/    # Providers (Auth, Theme)
│   │   └── router/       # Rotas
│   ├── components/        # Componentes reutilizáveis
│   ├── features/         # Features (Bookmarks, Collections, Tags)
│   ├── services/         # Serviços de API
│   │   ├── apiClient.ts  # Cliente HTTP centralizado
│   │   ├── authService.ts
│   │   ├── bookmarksService.ts
│   │   └── uploadService.ts
│   ├── shared/           # Código compartilhado
│   └── config/           # Configurações
│       └── api.ts        # Configuração da API
```

## 🔌 Serviços de API

### apiClient.ts

Cliente HTTP centralizado usando `fetch` nativo:

```typescript
import { get, post, patch, del } from '@services/apiClient';

// GET
const data = await get<ResponseType>('/api/endpoint', true); // true = requer auth

// POST
const result = await post<ResponseType>('/api/endpoint', { data }, true);

// PATCH
const updated = await patch<ResponseType>('/api/endpoint/:id', { data }, true);

// DELETE
await del<ResponseType>('/api/endpoint/:id', true);
```

### authService.ts

Serviço de autenticação:

```typescript
import { authService } from '@services/authService';

// Login
const { user, token } = await authService.login({ email, password });

// Registro
const { user, token } = await authService.register({ name, email, password });

// Obter usuário atual
const { user } = await authService.getMe();
```

### bookmarksService.ts

Serviço de bookmarks:

```typescript
import { bookmarksService } from '@services/bookmarksService';

// Listar com filtros
const { data, total } = await bookmarksService.getBookmarks({
  search: 'react',
  isFavorite: true,
  limit: 20,
  offset: 0,
});

// Criar
const { bookmark } = await bookmarksService.createBookmark({
  title: 'React Docs',
  url: 'https://react.dev',
  tags: ['react', 'frontend'],
});

// Atualizar
const { bookmark } = await bookmarksService.updateBookmark(id, { title: 'Novo título' });

// Deletar
await bookmarksService.deleteBookmark(id);
```

### uploadService.ts

Serviço de upload de imagens:

```typescript
import { uploadImage } from '@services/uploadService';

const file = e.target.files[0];
const { url } = await uploadImage(file);
// url = "/uploads/image-1234567890.png"
```

## 🔐 Autenticação

O token JWT é armazenado em `localStorage` com a chave `react-delicious-token`.

Todas as requisições autenticadas incluem automaticamente o header:
```
Authorization: Bearer <token>
```

O `apiClient` gerencia isso automaticamente quando `auth: true` é passado.

## 🎨 Hooks Customizados

### useBookmarks()

Hook para gerenciar bookmarks:

```typescript
import { useBookmarks } from '@features/bookmarks/hooks';

function MyComponent() {
  const {
    bookmarks,
    filteredBookmarks,
    isLoading,
    loadBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    toggleRead,
  } = useBookmarks();

  useEffect(() => {
    loadBookmarks();
  }, []);

  // ...
}
```

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

- Verifique se o backend está rodando
- Confirme que `VITE_API_URL` está configurado corretamente
- Verifique CORS no backend

### Erro: "Token não encontrado"

- Faça login novamente
- Verifique se o token está em `localStorage`

### Bookmarks não carregam

- Verifique se está autenticado
- Abra o console do navegador para ver erros
- Verifique a resposta da API no Network tab

## 📝 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 🔗 Links Úteis

- [Backend README](../back/README.md)
- [API Examples](../back/API_EXAMPLES.md)
