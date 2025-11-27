import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBookmarks } from '@features/bookmarks/hooks';
import { BookmarkForm } from '@features/bookmarks/components';
import { CreateBookmarkInput, UpdateBookmarkInput } from '@shared/types/bookmark';

export default function NewBookmarkPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addBookmark, isLoading } = useBookmarks();
  

  const collectionId = searchParams.get('collectionId') || undefined;

  const handleSubmit = async (data: CreateBookmarkInput | UpdateBookmarkInput) => {
    try {
      await addBookmark(data as CreateBookmarkInput);
      navigate('/bookmarks');
    } catch (error) {
      console.error('Erro ao criar bookmark:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/bookmarks');
  };

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          Novo Bookmark
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Adicione um novo link aos seus favoritos
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
        <BookmarkForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          initialCollectionId={collectionId}
        />
      </div>
    </div>
  );
}
