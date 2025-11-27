import { useState, useEffect, useRef } from 'react';
import { Bookmark, CreateBookmarkInput, UpdateBookmarkInput } from '@shared/types/bookmark';
import { CreateBookmarkSchema, UpdateBookmarkSchema } from '@shared/types/bookmark';
import { Input } from '@components/ui/Input';
import { Textarea } from '@components/ui/Textarea';
import { Button } from '@components/ui/Button';
import { Select } from '@components/ui/Select';
import { useCollections } from '@features/collections/hooks';
import { useTags } from '@features/tags/hooks';
import { clsx } from 'clsx';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { uploadImage } from '@services/uploadService';

export interface BookmarkFormProps {
  bookmark?: Bookmark;
  onSubmit: (data: CreateBookmarkInput | UpdateBookmarkInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
  initialCollectionId?: string;
}

interface FormData {
  title: string;
  url: string;
  description: string;
  tags: string;
  collectionId?: string;
  image?: string | null;
}

interface FormErrors {
  title?: string;
  url?: string;
  description?: string;
  tags?: string;
  collectionId?: string;
  image?: string;
  _general?: string;
}

const ensureHttpProtocol = (url: string): string => {
  if (!url) return url;
  const trimmed = url.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export function BookmarkForm({
  bookmark,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
  initialCollectionId,
}: BookmarkFormProps) {
  const isEditing = !!bookmark;

  const { collections, loadCollections } = useCollections();
  const { tags, loadTags } = useTags();

  useEffect(() => {
    loadCollections();
    loadTags();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    title: bookmark?.title || '',
    url: bookmark?.url || '',
    description: bookmark?.description || '',
    tags: Array.isArray(bookmark?.tags) 
      ? bookmark.tags.map((t) => typeof t === 'string' ? t : t.name).join(', ') 
      : '',
    collectionId: bookmark?.collectionId || initialCollectionId || '',
    image: bookmark?.image || null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(bookmark?.image || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  // Atualizar formulário quando bookmark muda
  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || '',
        tags: Array.isArray(bookmark.tags) 
          ? bookmark.tags.map((t) => typeof t === 'string' ? t : t.name).join(', ') 
          : '',
        collectionId: bookmark.collectionId || '',
        image: bookmark.image || null,
      });

      if (bookmark.image) {
        if (bookmark.image.startsWith('http') || bookmark.image.startsWith('/uploads')) {
          const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
          setImagePreview(bookmark.image.startsWith('http') ? bookmark.image : `${baseURL}${bookmark.image}`);
        } else {
          setImagePreview(bookmark.image);
        }
      } else {
        setImagePreview(null);
      }
      setErrors({});
    }
  }, [bookmark]);

    // Pré-selecionar coleção quando initialCollectionId é fornecido (apenas na montagem inicial)
    useEffect(() => {
    if (!bookmark && initialCollectionId) {
      setFormData((prev) => {
        // Só atualiza se ainda não tiver collectionId definido
        if (!prev.collectionId) {
          return { ...prev, collectionId: initialCollectionId };
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler para seleção de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, _general: 'Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP)' }));
      return;
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, _general: 'A imagem deve ter no máximo 2MB' }));
      return;
    }

    // Salvar arquivo para upload posterior
    setImageFile(file);

    // Mostrar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, _general: undefined }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler para mudanças nos campos
  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const normalizeFormData = (data: FormData): FormData => ({
    ...data,
    url: ensureHttpProtocol(data.url),
  });

  // Validar formulário com Zod
  const validate = (data: FormData): boolean => {
    const newErrors: FormErrors = {};

    try {
      // Converter tags de string para array
      const tagsArray = data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Validar com Zod schema apropriado
      const dataToValidate = {
        title: data.title,
        url: data.url,
        description: data.description || undefined,
        tags: tagsArray,
        collectionId: data.collectionId || undefined,
        favorite: bookmark?.favorite || false,
        read: bookmark?.read || false,
        image: data.image || undefined,
      };

      if (isEditing && bookmark) {
        // Validação para edição
        UpdateBookmarkSchema.parse({
          id: bookmark.id,
          ...dataToValidate,
        });
      } else {
        // Validação para criação
        CreateBookmarkSchema.parse(dataToValidate);
      }

      setErrors({});
      return true;
    } catch (error: any) {
      // Processar erros do Zod
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

  // Handler para submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedData = normalizeFormData(formData);
    if (normalizedData.url !== formData.url) {
      setFormData((prev) => ({ ...prev, url: normalizedData.url }));
    }

    if (!validate(normalizedData)) {
      return;
    }

    try {
      // Se houver arquivo selecionado, fazer upload primeiro
      let imageUrl = formData.image || null;

      if (imageFile) {
        setIsUploadingImage(true);
        try {
          const uploadResponse = await uploadImage(imageFile);
          imageUrl = uploadResponse.url;
          // Se for URL relativa, montar URL completa
          if (imageUrl.startsWith('/uploads')) {
            const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
            imageUrl = `${baseURL}${imageUrl}`;
          }
        } catch (uploadError) {
          setErrors((prev) => ({
            ...prev,
            _general: uploadError instanceof Error ? uploadError.message : 'Erro ao fazer upload da imagem',
          }));
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Converter tags de string para array
      const tagsArray = normalizedData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const formPayload = {
        title: normalizedData.title,
        url: normalizedData.url,
        description: normalizedData.description || undefined,
        tags: tagsArray,
        collectionId: normalizedData.collectionId || undefined,
        favorite: bookmark?.favorite || false,
        read: bookmark?.read || false,
        image: imageUrl || undefined,
      };

      if (isEditing && bookmark) {

        if (!bookmark.id || typeof bookmark.id !== 'string' || bookmark.id.length === 0) {
          throw new Error('Bookmark não possui ID válido. Recarregue a página.');
        }
        await onSubmit({ id: bookmark.id, ...formPayload } as UpdateBookmarkInput);
      } else {

        await onSubmit(formPayload as CreateBookmarkInput);
      }
    } catch (error: any) {
      setErrors({
        _general: error.message || 'Erro ao salvar bookmark',
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
        label="Título *"
        type="text"
        value={formData.title}
        onChange={handleChange('title')}
        error={errors.title}
        placeholder="Digite o título do bookmark"
        required
        disabled={isLoading}
        className="rounded-xl"
      />

      <Input
        label="URL *"
        type="url"
        value={formData.url}
        onChange={handleChange('url')}
        error={errors.url}
        placeholder="https://exemplo.com"
        required
        disabled={isLoading}
        className="rounded-xl"
      />

      <Textarea
        label="Descrição"
        value={formData.description}
        onChange={handleChange('description')}
        error={errors.description}
        placeholder="Adicione uma descrição opcional"
        rows={4}
        disabled={isLoading}
        className="rounded-xl"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Imagem <span className="text-xs text-neutral-500 dark:text-neutral-400">(Opcional)</span>
        </label>
        <div className="flex items-start gap-4">
          <div className="w-[120px] h-[120px] rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden relative group">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 p-1 rounded-full bg-neutral-900/70 dark:bg-neutral-100/70 text-white dark:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  aria-label="Remover imagem"
                >
                  <XMarkIcon className="w-4 h-4" strokeWidth={2} />
                </button>
              </>
            ) : (
              <PhotoIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="bookmark-image-upload"
              disabled={isLoading}
            />
            <label htmlFor="bookmark-image-upload">
              <span className="inline-block">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="rounded-lg cursor-pointer"
                >
                  <PhotoIcon className="w-4 h-4" strokeWidth={2} />
                  {imagePreview ? 'Alterar Imagem' : 'Enviar Imagem'}
                </Button>
              </span>
            </label>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Formatos aceitos: JPG, PNG, GIF. Máximo 2MB.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Input
          label="Tags"
          type="text"
          value={formData.tags}
          onChange={handleChange('tags')}
          error={errors.tags}
          placeholder="react, frontend, javascript (separadas por vírgula)"
          helperText={`Separe as tags por vírgulas. Tags disponíveis: ${tags.slice(0, 5).map((t) => t.name).join(', ')}${tags.length > 5 ? '...' : ''}`}
          disabled={isLoading}
          className="rounded-xl"
        />
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  const currentTags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
                  if (!currentTags.includes(tag.name)) {
                    const newTags = [...currentTags, tag.name].join(', ');
                    setFormData((prev) => ({ ...prev, tags: newTags }));
                  }
                }}
                className="px-2 py-1 text-xs rounded-md bg-primary-500/8 text-primary-600 dark:text-primary-400 border border-primary-500/15 hover:bg-primary-500/12 transition-colors duration-150"
                disabled={isLoading}
              >
                + {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <Select
        label="Coleção"
        value={formData.collectionId || ''}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, collectionId: e.target.value || undefined }));
          if (errors.collectionId) {
            setErrors((prev) => ({ ...prev, collectionId: undefined }));
          }
        }}
        error={errors.collectionId}
        placeholder="Selecione uma coleção (opcional)"
        helperText="Selecione a coleção a qual este bookmark pertence"
        disabled={isLoading}
        className="rounded-xl"
        options={[
          { value: '', label: 'Nenhuma coleção' },
          ...collections.map((collection) => ({
            value: collection.id,
            label: collection.name,
          })),
        ]}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(0,0,0,0.08)] dark:border-neutral-800/50">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading || isUploadingImage}
          disabled={isLoading}
          className="rounded-xl"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Bookmark'}
        </Button>
      </div>
    </form>
  );
}
