# Design System - React Delicious+

Documentação dos componentes UI do projeto.

---

## 🧩 Componentes

### Button

```tsx
import { Button } from '@components/ui';

<Button variant="primary" size="md">Salvar</Button>
<Button variant="outline" isLoading>Carregando...</Button>
```

**Variantes:** `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Tamanhos:** `sm`, `md` (padrão), `lg`  
**Props especiais:** `isLoading` - Exibe spinner e desabilita

---

### Input / Textarea

```tsx
import { Input, Textarea } from '@components/ui';

<Input
  label="Nome"
  placeholder="Digite seu nome"
  error="Nome é obrigatório"
  helperText="Texto de ajuda"
/>

<Textarea
  label="Descrição"
  placeholder="Digite uma descrição"
  rows={4}
/>
```

**Props principais:** `label`, `error`, `helperText`, `disabled`

---

### Select

```tsx
import { Select } from '@components/ui';

<Select
  label="Coleção"
  options={[
    { value: '1', label: 'Design' },
    { value: '2', label: 'Desenvolvimento' },
  ]}
  placeholder="Selecione uma coleção"
/>
```

**Props:** `options` (array de `{ value, label }`), `label`, `placeholder`

---

### Tag

```tsx
import { Tag } from '@components/ui';

<Tag variant="purple">Design System</Tag>
<Tag variant="blue" onRemove={() => removeTag('id')}>React</Tag>
```

**Variantes:** `default`, `purple`, `blue`, `green`, `orange`  
**Props:** `onRemove` - Callback para remover tag (exibe botão X)

---

### Card

```tsx
import { Card } from '@components/ui';

<Card variant="default">
  <h3>Título</h3>
  <p>Conteúdo do card</p>
</Card>

<Card variant="hover" onClick={handleClick}>
  Card clicável
</Card>
```

**Variantes:** `default`, `outlined`, `hover`

---

### Toggle

```tsx
import { Toggle } from '@components/ui';

<Toggle
  checked={isEnabled}
  onChange={(e) => setIsEnabled(e.target.checked)}
  label="Habilitar notificações"
  description="Receba notificações sobre novos bookmarks"
/>
```

**Props:** `checked`, `onChange`, `label`, `description`

---

### Modal

```tsx
import { Modal, Button } from '@components/ui';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Adicionar Bookmark"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
      <Button variant="primary">Salvar</Button>
    </>
  }
>
  <p>Conteúdo do modal</p>
</Modal>
```

**Props:** `open`, `onClose`, `title`, `size` (`sm`, `md`, `lg`, `xl`), `footer`  
**Recursos:** Fecha com ESC, overlay com blur, portal, gerenciamento de foco

---

### Drawer

```tsx
import { Drawer } from '@components/ui';

<Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Detalhes do Bookmark"
  width="md"
>
  <p>Conteúdo do drawer</p>
</Drawer>
```

**Props:** `open`, `onClose`, `title`, `width` (`sm`, `md`, `lg`, `xl`)  
**Recursos:** Animação slide-in-right, scroll interno, fecha com ESC

---

### EmptyState

```tsx
import { EmptyState } from '@components/ui';

<EmptyState
  icon={<InboxIcon />}
  title="Nenhum bookmark por aqui"
  description="Comece adicionando seu primeiro bookmark"
  actionLabel="Adicionar Bookmark"
  onAction={() => openModal()}
/>
```

**Props:** `icon`, `title`, `description`, `actionLabel`, `onAction`

---

### Spinner / PageLoader

```tsx
import { Spinner, PageLoader } from '@components/ui';

<Spinner size="md" />
<PageLoader message="Carregando bookmarks..." />
```

**Props:** `Spinner`: `size` (`xs`, `sm`, `md`, `lg`)  
**Props:** `PageLoader`: `message` (opcional)

---

## 🎨 Variantes com CVA

**Class Variance Authority (CVA)** é usado para criar variantes de componentes de forma type-safe.

**Exemplo:**
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white',
        secondary: 'bg-neutral-200 text-neutral-900',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

---

## ♿ Acessibilidade

Todos os componentes seguem as diretrizes WCAG 2.1:

- **ARIA Labels:** Componentes interativos têm `aria-label` ou `aria-labelledby`
- **Keyboard Navigation:** Navegação completa via teclado
- **Focus Management:** Foco gerenciado corretamente (modals, drawers)
- **Screen Readers:** Componentes anunciados corretamente

---

## 📝 Padrões de Uso

### 1. Quando usar CVA?

- ✅ Componente tem múltiplas variantes (cores, tamanhos, estilos)
- ✅ Variantes são mutuamente exclusivas ou combináveis

### 2. Estrutura de arquivos

```
components/ui/
├── Button.tsx
├── Input.tsx
├── Tag.tsx
└── index.ts  # Exports centralizados
```

**Regra:** Um componente por arquivo, exportar tudo em `index.ts`.

---

## ✅ Guidelines

### 1. Imports

**Sempre use o export centralizado:**
```tsx
// ✅ Correto
import { Button, Input, Tag } from '@components/ui';

// ❌ Evitar
import { Button } from '@components/ui/Button';
```

### 2. Nomenclatura

- **Componentes:** PascalCase (`Button`, `Input`, `Tag`)
- **Props:** camelCase (`isLoading`, `onClick`, `variant`)
- **Variantes:** lowercase (`primary`, `secondary`, `outline`)

### 3. Tipos

**Sempre exporte tipos junto com componentes:**
```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...);
```

---

**Última atualização:** Etapa 2 - Design System