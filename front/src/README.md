# Arquitetura do React Delicious+

Documentação da arquitetura e estrutura do projeto.

---

## 📁 Estrutura de Pastas

```
src/
├── app/                    # Configuração global
│   ├── providers/          # Providers (Context API)
│   ├── router/             # Rotas (React Router)
│   └── store/              # Estado global (Zustand)
│
├── features/               # Features (arquitetura feature-based)
│   ├── bookmarks/
│   ├── collections/
│   ├── tags/
│   ├── backup/
│   └── about/
│
├── components/             # Componentes compartilhados
│   ├── ui/                 # Design system
│   └── layout/             # Layout (Sidebar, Navbar)
│
├── services/               # Serviços compartilhados
│
├── shared/                 # Código compartilhado
│   ├── libs/               # Bibliotecas (storage)
│   ├── utils/              # Utilitários
│   └── types/              # Tipos TypeScript e schemas Zod
│
├── styles/                 # Estilos globais
└── assets/                 # Assets estáticos
```

---

## 🏗️ Arquitetura Feature-Based

Cada feature é auto-contida e organizada assim:

```
features/bookmarks/
├── index.ts                # Exports públicos
├── components/             # Componentes específicos
├── pages/                  # Páginas (rotas)
├── hooks/                  # Hooks customizados
├── services/               # Services de acesso a dados
└── store/                  # Estado local (Zustand)
```

**Regras de importação:**
- ✅ Pode importar de: `@shared/*`, `@components/ui`, `@app/*`
- ❌ Não importar de outras features diretamente

---

## 🎯 Padrões Principais

### Componentes

```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export function Component({ title, onClick }: ComponentProps) {
  return <div onClick={onClick}>{title}</div>;
}
```

### Hooks Customizados

```typescript
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  // lógica reativa
  return { bookmarks, isLoading, error };
}
```

### Estado Global (Zustand)

```typescript
export const useBookmarksStore = create<BookmarksState>()((set) => ({
  bookmarks: [],
  setBookmarks: (bookmarks) => set({ bookmarks }),
}));
```

### Variantes com CVA

```typescript
const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'bg-primary-500',
      secondary: 'bg-neutral-200',
    },
  },
});
```

---

## 📦 Estado e Persistência

- **Zustand:** Estado global com persistência automática
- **IndexedDB:** Storage offline via Dexie
- **Repositórios:** Interface `IRepository<T>` para abstrair acesso aos dados

---

## 🛣️ Roteamento

- **React Router v6** em `app/router/index.tsx`
- Lazy loading com `React.lazy()` + `Suspense`

---

## 📝 Convenções

### Nomenclatura

- **Componentes:** PascalCase (`BookmarkCard.tsx`)
- **Hooks:** camelCase com `use` (`useBookmarks.ts`)
- **Services:** camelCase + `Service` (`bookmarks.service.ts`)
- **Types:** PascalCase (`Bookmark`, `BookmarkId`)

### Imports

```typescript
// 1. React e bibliotecas
import { useState } from 'react';

// 2. Internos (aliases)
import { Button } from '@components/ui';
import { useBookmarks } from '@features/bookmarks/hooks';

// 3. Types
import type { Bookmark } from '@shared/types';
```

**Path Aliases:**
- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@components/*` → `src/components/*`
- `@shared/*` → `src/shared/*`
- `@services/*` → `src/services/*`

---

## 🎨 Design System

- **Componentes base:** `components/ui/`
- **Tokens:** `tailwind.config.js`
- **Estilos globais:** `styles/globals.css`
- **Dark mode:** Via classe CSS

---

## 🔧 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Zustand** - Estado global
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas
- **Dexie** - IndexedDB wrapper
- **CVA** - Variantes de componentes

---

## 🚀 Fluxo de Trabalho

### Adicionar Nova Feature

1. Criar pasta em `features/nova-feature/`
2. Criar estrutura base (components/, pages/, hooks/, services/)
3. Adicionar rotas em `app/router/`
4. Implementar lógica

### Adicionar Componente UI

1. Criar em `components/ui/Componente.tsx`
2. Usar `cva()` para variantes
3. Exportar em `components/ui/index.ts`

---

## 📚 Recursos

- [React Router Docs](https://reactrouter.com/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Class Variance Authority](https://cva.style/)
- [Zod Validation](https://zod.dev/)
