import { useState, useEffect } from 'react';
import { Tag, CreateTagInput, UpdateTagInput } from '@shared/types/tag';
import { CreateTagSchema, UpdateTagSchema } from '@shared/types/tag';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { clsx } from 'clsx';

export interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: CreateTagInput | UpdateTagInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

interface FormData {
  name: string;
}

interface FormErrors {
  name?: string;
  _general?: string;
}

export function TagForm({
  tag,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: TagFormProps) {
  const isEditing = !!tag;

  const [formData, setFormData] = useState<FormData>({
    name: tag?.name || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
      });
      setErrors({});
    }
  }, [tag]);

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
      };

      if (isEditing && tag) {
        UpdateTagSchema.parse({
          id: tag.id,
          ...dataToValidate,
        });
      } else {
        CreateTagSchema.parse(dataToValidate);
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
        name: formData.name.trim(),
      };

      if (isEditing && tag) {
        await onSubmit({ id: tag.id, ...formPayload } as UpdateTagInput);
      } else {
        await onSubmit(formPayload as CreateTagInput);
      }
    } catch (error: any) {
      setErrors({
        _general: error.message || 'Erro ao salvar tag',
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
        placeholder="Digite o nome da tag"
        required
        disabled={isLoading}
        className="rounded-lg"
      />

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
          {isEditing ? 'Salvar Alterações' : 'Criar Tag'}
        </Button>
      </div>
    </form>
  );
}

