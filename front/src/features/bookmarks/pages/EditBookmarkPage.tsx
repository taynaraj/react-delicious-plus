import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookmarks } from '@features/bookmarks/hooks';
import { BookmarkForm } from '@features/bookmarks/components';
import { CreateBookmarkInput, UpdateBookmarkInput } from '@shared/types/bookmark';
import { Bookmark } from '@shared/types/bookmark';
import { Spinner } from '@components/ui';
import { EmptyState } from '@components/ui';

export default function EditBookmarkPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { bookmarks, updateBookmark, isLoading, loadBookmarks } = useBookmarks();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/bookmarks');
      return;
    }

    if (!id || typeof id !== 'string' || id.length === 0) {
      navigate('/bookmarks');
      return;
    }

    const found = bookmarks.find((b) => b.id === id);
    if (found) {
      if (!found.id || typeof found.id !== 'string' || found.id.length === 0) {
        console.error('Bookmark encontrado mas com ID inválido:', found);
        navigate('/bookmarks');
        return;
      }
      setBookmark(found);
      return;
    }

    loadBookmarks().then(() => {
      const updated = bookmarks.find((b) => b.id === id);
      if (!updated || !updated.id || typeof updated.id !== 'string' || updated.id.length === 0) {
        console.error('Bookmark não encontrado após recarregar:', id);
        navigate('/bookmarks');
      } else {
        setBookmark(updated);
      }
    });
  }, [id, bookmarks, navigate, loadBookmarks]);

  const handleSubmit = async (data: UpdateBookmarkInput | CreateBookmarkInput) => {
    if (!id) return;

    try {
      await updateBookmark(id, data as UpdateBookmarkInput);
      navigate('/bookmarks');
    } catch (error) {
      console.error('Erro ao atualizar bookmark:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/bookmarks');
  };

  if (isLoading && !bookmark) {
    return (
      <div className="min-h-full flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bookmark) {
    return (
      <div className="min-h-full">
        <div className="flex items-center justify-center py-24">
          <EmptyState
            icon={
              <svg
                className="h-12 w-12 text-neutral-400 dark:text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Bookmark não encontrado"
            description="O bookmark que você está tentando editar não foi encontrado."
            actionLabel="Voltar para Bookmarks"
            onAction={() => navigate('/bookmarks')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          Editar Bookmark
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Atualize as informações do bookmark
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
        <BookmarkForm
          bookmark={bookmark}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
