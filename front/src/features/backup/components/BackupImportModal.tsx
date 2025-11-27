import { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import type { BackupPayload } from '../schemas/backup.schema';
import { useBookmarksStore } from '@features/bookmarks/store';
import { useCollectionsStore } from '@features/collections/store';
import { useTagsStore } from '@features/tags/store';
import { ExclamationTriangleIcon, ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export interface BackupImportModalProps {
  open: boolean;
  backup: BackupPayload | null;
  onClose: () => void;
  onImportComplete: () => void;
}

type ImportMode = 'replace' | 'merge';

export function BackupImportModal({
  open,
  backup,
  onClose,
  onImportComplete,
}: BackupImportModalProps) {
  const [selectedMode, setSelectedMode] = useState<ImportMode | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contadores atuais
  const currentBookmarks = useBookmarksStore((state) => state.bookmarks);
  const currentCollections = useCollectionsStore((state) => state.collections);
  const currentTags = useTagsStore((state) => state.tags);

  // Store actions
  const bookmarksStore = useBookmarksStore();
  const collectionsStore = useCollectionsStore();
  const tagsStore = useTagsStore();

  // Handler de importação
  const handleImport = async () => {
    if (!backup || !selectedMode) return;

    setIsImporting(true);
    setError(null);

    try {
      // Importar bookmarks
      if (selectedMode === 'replace') {
        await bookmarksStore.importReplace(backup.bookmarks);
        await collectionsStore.importReplace(backup.collections);
        await tagsStore.importReplace(backup.tags);
      } else {
        const collectionMap = await collectionsStore.importMerge(backup.collections);
        await tagsStore.importMerge(backup.tags);
        await bookmarksStore.importMerge(backup.bookmarks, collectionMap);
      }

      await bookmarksStore.loadBookmarks();
      await collectionsStore.loadCollections();
      await tagsStore.loadTags();

      onImportComplete();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao importar backup';
      setError(message);
    } finally {
      setIsImporting(false);
    }
  };

  if (!backup) return null;

  return (
    <Modal open={open} onClose={onClose} title="Importar Backup">
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-warning-50 dark:bg-warning-950/20 border border-warning-200 dark:border-warning-800/50">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" strokeWidth={1.7} />
            <div className="flex-1">
              <h4 className="font-display font-semibold text-sm text-warning-900 dark:text-warning-50 mb-1">
                Aviso Importante
              </h4>
              <p className="text-sm text-warning-700 dark:text-warning-300 leading-relaxed">
                Esta operação modificará seus dados. Certifique-se de ter um backup antes de continuar.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50">
          <h4 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-3">
            Dados a serem importados:
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{backup.bookmarks.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Bookmarks</div>
            </div>
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{backup.collections.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Coleções</div>
            </div>
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{backup.tags.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Tags</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50">
          <h4 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-3">
            Dados atuais:
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{currentBookmarks.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Bookmarks</div>
            </div>
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{currentCollections.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Coleções</div>
            </div>
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{currentTags.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Tags</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-3">
            Escolha o modo de importação:
          </h4>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedMode('replace')}
              className={clsx(
                'w-full p-4 rounded-lg border-2 transition-all duration-150 text-left',
                selectedMode === 'replace'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                  selectedMode === 'replace'
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-neutral-300 dark:border-neutral-700'
                )}>
                  {selectedMode === 'replace' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowPathIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" strokeWidth={1.7} />
                    <h5 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-50">
                      Substituir Todos os Dados
                    </h5>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Remove todos os dados atuais e substitui pelos dados do backup.
                    <strong className="text-error-600 dark:text-error-400"> Esta ação não pode ser desfeita.</strong>
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('merge')}
              className={clsx(
                'w-full p-4 rounded-lg border-2 transition-all duration-150 text-left',
                selectedMode === 'merge'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                  selectedMode === 'merge'
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-neutral-300 dark:border-neutral-700'
                )}>
                  {selectedMode === 'merge' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <PlusIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" strokeWidth={1.7} />
                    <h5 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-50">
                      Mesclar com Dados Existentes
                    </h5>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Adiciona novos dados e atualiza os existentes. Dados que não estão no backup serão mantidos.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-800/50">
            <p className="text-sm text-error-600 dark:text-error-400">
              {error}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(0,0,0,0.08)] dark:border-neutral-800/50">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isImporting}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleImport}
            isLoading={isImporting}
            disabled={!selectedMode || isImporting}
            className="rounded-lg"
          >
            {selectedMode === 'replace' ? 'Substituir Todos os Dados' : 'Mesclar Dados'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

