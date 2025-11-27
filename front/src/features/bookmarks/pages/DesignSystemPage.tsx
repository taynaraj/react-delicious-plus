import { useState } from 'react';
import {
  Button,
  Tag,
  Card,
  Input,
  Textarea,
  Select,
  Toggle,
  Modal,
  EmptyState,
  Spinner,
} from '@components/ui';

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="container-app max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Design System
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Demonstração dos componentes do React Delicious+
          </p>
        </div>

        {/* Grid de Componentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seção: Botões */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Botões
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button isLoading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Card>

          {/* Seção: Tags */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Tags / Badges
            </h2>
            <div className="flex flex-wrap gap-2">
              <Tag variant="default">Default</Tag>
              <Tag variant="purple">Purple</Tag>
              <Tag variant="blue">Blue</Tag>
              <Tag variant="green">Green</Tag>
              <Tag variant="orange">Orange</Tag>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Tag variant="purple" onRemove={() => alert('Tag removida')}>
                Removível
              </Tag>
              <Tag variant="blue" onRemove={() => alert('Tag removida')}>
                React
              </Tag>
            </div>
          </Card>

          {/* Seção: Inputs */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Inputs
            </h2>
            <div className="space-y-4">
              <Input
                label="Nome"
                placeholder="Digite seu nome"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Email"
                placeholder="Digite seu email"
                type="email"
                error="Email inválido"
              />
              <Input
                label="Com Helper Text"
                placeholder="Digite algo"
                helperText="Este campo é opcional"
              />
              <Input
                label="Desabilitado"
                placeholder="Não pode editar"
                disabled
              />
            </div>
          </Card>

          {/* Seção: Textarea e Select */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Textarea e Select
            </h2>
            <div className="space-y-4">
              <Textarea
                label="Descrição"
                placeholder="Digite uma descrição"
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
              />
              <Select
                label="Coleção"
                placeholder="Selecione uma coleção"
                options={[
                  { value: '1', label: 'Design' },
                  { value: '2', label: 'Desenvolvimento' },
                  { value: '3', label: 'Inspiração' },
                ]}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              />
            </div>
          </Card>

          {/* Seção: Toggle */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Toggle / Switch
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Marcar como Favorito"
                checked={isToggled}
                onChange={(e) => setIsToggled(e.target.checked)}
              />
              <Toggle
                label="Marcar como Lido"
                description="Indica que você já leu este bookmark"
                checked={!isToggled}
                onChange={(e) => setIsToggled(!e.target.checked)}
              />
              <Toggle
                label="Tema Escuro"
                description="Alterna entre tema claro e escuro"
                checked={false}
                disabled
              />
            </div>
          </Card>

          {/* Seção: Cards */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Cards (Variantes)
            </h2>
            <div className="space-y-4">
              <Card variant="default" className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Card Default - com sombra leve
                </p>
              </Card>
              <Card variant="outlined" className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Card Outlined - apenas com borda
                </p>
              </Card>
              <Card variant="hover" className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Card Hover - efeito hover (passe o mouse)
                </p>
              </Card>
            </div>
          </Card>

          {/* Seção: Modal */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Modal
            </h2>
            <div className="space-y-4">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Abrir Modal
              </Button>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Clique no botão para abrir um modal de exemplo.
              </p>
            </div>
          </Card>

          {/* Seção: EmptyState */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Empty State
            </h2>
            <EmptyState
              icon={
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              }
              title="Nenhum bookmark por aqui ainda!"
              description="Comece adicionando seu primeiro bookmark para organizar seus favoritos."
              actionLabel="Adicionar Bookmark"
              onAction={() => setIsModalOpen(true)}
            />
          </Card>

          {/* Seção: Spinner */}
          <Card variant="default" className="p-6">
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Spinner / Loader
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Spinners em diferentes tamanhos
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Novo Bookmark"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary">Salvar Bookmark</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="URL"
            placeholder="https://exemplo.com"
            type="url"
          />
          <Input
            label="Título"
            placeholder="Digite um título para o seu link"
          />
          <Textarea
            label="Descrição"
            placeholder="Adicione uma nota pessoal sobre este link"
            rows={4}
          />
          <Select
            label="Coleção"
            placeholder="Selecione uma coleção"
            options={[
              { value: '1', label: 'Design' },
              { value: '2', label: 'Desenvolvimento' },
              { value: '3', label: 'Inspiração' },
            ]}
          />
          <div className="space-y-2">
            <Toggle
              label="Marcar como Favorito"
              description="Salva este bookmark nos seus favoritos"
            />
            <Toggle
              label="Marcar como Lido"
              description="Indica que você já leu este conteúdo"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
