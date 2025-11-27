import { useState } from 'react';
import { Button } from '@components/ui/Button';
import { exportBackup } from '../services/backup.service';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useBookmarksStore } from '@features/bookmarks/store';
import { useCollectionsStore } from '@features/collections/store';
import { useTagsStore } from '@features/tags/store';

export interface BackupExportProps {
  className?: string;
}

export function BackupExport({ className }: BackupExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const backup = await exportBackup();
      
      // Criar JSON formatado
      const json = JSON.stringify(backup, null, 2);
      
      // Criar blob e fazer download
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `react-delicious-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erro ao exportar backup. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Obter contadores
  const bookmarksCount = useBookmarksStore((state) => state.bookmarks.length);
  const collectionsCount = useCollectionsStore((state) => state.collections.length);
  const tagsCount = useTagsStore((state) => state.tags.length);

  return (
    <div className={className}>
      <div className="rounded-lg p-6 bg-white dark:bg-neutral-900 border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50" style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.05)' }}>
        <div className="mb-4">
          <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50 mb-2 tracking-tight">
            Exportar Dados
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Exporte todos os seus bookmarks, coleções e tags para um arquivo JSON.
            Você pode usar este arquivo para fazer backup ou transferir seus dados para outro dispositivo.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50">
          <div className="text-center">
            <div className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-50">
              {bookmarksCount}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Bookmarks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-50">
              {collectionsCount}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Coleções</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-50">
              {tagsCount}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Tags</div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleExport}
          isLoading={isExporting}
          disabled={isExporting || (bookmarksCount === 0 && collectionsCount === 0 && tagsCount === 0)}
          className="w-full rounded-lg"
        >
          <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.7} />
          {isExporting ? 'Exportando...' : 'Exportar Dados'}
        </Button>

        {(bookmarksCount === 0 && collectionsCount === 0 && tagsCount === 0) && (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Não há dados para exportar.
          </p>
        )}
      </div>
    </div>
  );
}

