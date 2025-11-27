import { useState, useEffect, useRef } from 'react';
import { Collection, CreateCollectionInput, UpdateCollectionInput } from '@shared/types/collection';
import { CreateCollectionSchema, UpdateCollectionSchema } from '@shared/types/collection';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { EmojiPicker } from '@components/ui/EmojiPicker';
import { clsx } from 'clsx';

export interface CollectionFormProps {
  collection?: Collection;
  onSubmit: (data: CreateCollectionInput | UpdateCollectionInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

interface FormData {
  name: string;
  emoji: string;
}

interface FormErrors {
  name?: string;
  emoji?: string;
  _general?: string;
}

export function CollectionForm({
  collection,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: CollectionFormProps) {
  const isEditing = !!collection;

  const [formData, setFormData] = useState<FormData>({
    name: collection?.name || '',
    emoji: collection?.emoji || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const iconInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        emoji: collection.emoji || '',
      });
      setErrors({});
    }
  }, [collection]);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    try {
      const dataToValidate = {
        name: formData.name,
        emoji: formData.emoji || undefined,
      };

      if (isEditing && collection) {
        UpdateCollectionSchema.parse({
          id: collection.id,
          ...dataToValidate,
        });
      } else {
        CreateCollectionSchema.parse(dataToValidate);
      }

      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof FormErrors;
          newErrors[field] = err.message;
        });
      } else {
        newErrors._general = error.message || 'Erro ao validar formulário';
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const formPayload = {
        name: formData.name,
        emoji: formData.emoji || undefined,
      };

      if (isEditing && collection) {
        await onSubmit({ id: collection.id, ...formPayload } as UpdateCollectionInput);
      } else {
        await onSubmit(formPayload as CreateCollectionInput);
      }
    } catch (error: any) {
      setErrors({
        _general: error.message || 'Erro ao salvar collection',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('space-y-6', className)}
      noValidate
    >
      {errors._general && (
        <div
          className="rounded-xl p-4 text-sm text-error-600 dark:text-error-400"
          style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
          }}
        >
          {errors._general}
        </div>
      )}

      <Input
        label="Nome *"
        type="text"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        placeholder="Digite o nome da coleção"
        required
        disabled={isLoading}
        className="rounded-lg"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Ícone (emoji)
        </label>
        <div ref={iconInputRef} className="relative">
          <Input
            type="text"
            value={formData.emoji}
            onChange={handleChange('emoji')}
            error={errors.emoji}
            placeholder="📁 ou outro emoji"
            disabled={isLoading}
            readOnly
            className="rounded-lg pr-10 cursor-pointer"
            onClick={() => !isLoading && setShowEmojiPicker(true)}
          />
          <button
            type="button"
            onClick={() => !isLoading && setShowEmojiPicker(true)}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer"
            aria-label="Abrir seletor de emoji"
          >
            <svg
              className="w-5 h-5 text-neutral-400 dark:text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </button>
        </div>
        {errors.emoji && (
          <p className="mt-1.5 text-sm text-error-600 dark:text-error-400">
            {errors.emoji}
          </p>
        )}
        {!errors.emoji && (
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            Use um emoji como ícone da coleção (opcional). Clique no campo para selecionar.
          </p>
        )}

        <EmojiPicker
          open={showEmojiPicker}
          anchorRef={iconInputRef}
          onSelect={(emoji) => {
            setFormData((prev) => ({ ...prev, emoji: emoji }));
            setShowEmojiPicker(false);
          }}
          onClose={() => setShowEmojiPicker(false)}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(0,0,0,0.08)] dark:border-neutral-800/50">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          className="rounded-lg"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Coleção'}
        </Button>
      </div>
    </form>
  );
}

