
import { useState, useRef } from 'react';
import { Button } from '@components/ui/Button';
import { Textarea } from '@components/ui/Textarea';
import { validateBackupFile } from '../services/backup.service';
import type { BackupPayload } from '../schemas/backup.schema';
import { ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export interface BackupImportProps {
  onImport: (backup: BackupPayload) => void;
  className?: string;
}

export function BackupImport({ onImport, className }: BackupImportProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [preview, setPreview] = useState<BackupPayload | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler para seleção de arquivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setJsonInput('');

    try {
      const text = await file.text();
      const backup = validateBackupFile(text);
      setJsonInput(text);
      setPreview(backup);
      setFileError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Arquivo inválido';
      setFileError(message);
      setPreview(null);
    }
  };

  // Handler para mudança no textarea
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    setJsonError(null);

    if (!value.trim()) {
      setPreview(null);
      return;
    }

    try {
      const backup = validateBackupFile(value);
      setPreview(backup);
      setJsonError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'JSON inválido';
      setJsonError(message);
      setPreview(null);
    }
  };

  // Handler para importar
  const handleImport = () => {
    if (!preview) return;
    onImport(preview);
  };

  return (
    <div className={className}>
      <div className="rounded-lg p-6 bg-white dark:bg-neutral-900 border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50" style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.05)' }}>
        <div className="mb-4">
          <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50 mb-2 tracking-tight">
            Importar Dados
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Importe dados de um arquivo de backup JSON ou cole o conteúdo manualmente.
          </p>
        </div>

        {/* Input de arquivo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Selecionar arquivo JSON
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg"
            >
              <DocumentTextIcon className="w-4 h-4" strokeWidth={1.7} />
              Escolher arquivo...
            </Button>
          </div>
          {fileError && (
            <p className="mt-2 text-sm text-error-600 dark:text-error-400">
              {fileError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">ou</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="mb-4">
          <Textarea
            label="Colar conteúdo JSON"
            value={jsonInput}
            onChange={handleJsonChange}
            error={jsonError || undefined}
            placeholder="Cole aqui o conteúdo do arquivo JSON de backup..."
            rows={8}
            className="rounded-lg font-mono text-xs"
          />
        </div>

        {/* Preview dos dados */}
        {preview && !jsonError && (
          <div className="mb-4 p-4 rounded-lg bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800/50">
            <h4 className="font-display font-semibold text-sm text-primary-900 dark:text-primary-50 mb-3">
              Pré-visualização dos dados:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-700 dark:text-primary-300">Bookmarks:</span>
                <span className="font-medium text-primary-900 dark:text-primary-50">{preview.bookmarks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-700 dark:text-primary-300">Coleções:</span>
                <span className="font-medium text-primary-900 dark:text-primary-50">{preview.collections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-700 dark:text-primary-300">Tags:</span>
                <span className="font-medium text-primary-900 dark:text-primary-50">{preview.tags.length}</span>
              </div>
              {preview.version && (
                <div className="flex justify-between pt-2 border-t border-primary-200 dark:border-primary-800/50">
                  <span className="text-primary-700 dark:text-primary-300">Versão:</span>
                  <span className="font-medium text-primary-900 dark:text-primary-50">{preview.version}</span>
                </div>
              )}
              {preview.exportedAt && (
                <div className="flex justify-between">
                  <span className="text-primary-700 dark:text-primary-300">Exportado em:</span>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {new Date(preview.exportedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleImport}
          disabled={!preview || !!jsonError || !!fileError}
          className="w-full rounded-lg"
        >
          <ArrowUpTrayIcon className="w-4 h-4" strokeWidth={1.7} />
          Continuar com Importação
        </Button>
      </div>
    </div>
  );
}

