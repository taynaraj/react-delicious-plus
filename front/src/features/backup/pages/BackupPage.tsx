
import { useState } from 'react';
import { BackupExport } from '../components/BackupExport';
import { BackupImport } from '../components/BackupImport';
import { BackupImportModal } from '../components/BackupImportModal';
import type { BackupPayload } from '../schemas/backup.schema';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function BackupPage() {
  const [importBackup, setImportBackup] = useState<BackupPayload | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleImport = (backup: BackupPayload) => {
    setImportBackup(backup);
    setShowImportModal(true);
  };
  const handleImportComplete = () => {
    setImportSuccess(true);
    setShowImportModal(false);
    setImportBackup(null);

    setTimeout(() => {
      setImportSuccess(false);
    }, 3000);
  };

  const handleCloseModal = () => {
    setShowImportModal(false);
    setImportBackup(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-1 tracking-tight">
          Backup
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Exporte ou importe seus dados
        </p>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-lg bg-success-50 dark:bg-success-950/20 border border-success-200 dark:border-success-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" strokeWidth={1.7} />
            <div>
              <h4 className="font-display font-semibold text-sm text-success-900 dark:text-success-50 mb-0.5">
                Importação concluída com sucesso!
              </h4>
              <p className="text-sm text-success-700 dark:text-success-300">
                Todos os dados foram importados corretamente.
              </p>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BackupExport />

        <BackupImport onImport={handleImport} />
      </div>

      <BackupImportModal
        open={showImportModal}
        backup={importBackup}
        onClose={handleCloseModal}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
