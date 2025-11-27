import { Modal } from './Modal';
import { Button } from './Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar exclusão',
  message = 'Tem certeza que deseja excluir este item?',
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="md"
      closeOnOverlayClick={!isLoading}
      showCloseButton={!isLoading}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="rounded-lg"
          >
            Excluir
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" strokeWidth={1.7} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {message}
          </p>
          {itemName && (
            <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              "{itemName}"
            </p>
          )}
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500">
            Esta ação não pode ser desfeita.
          </p>
        </div>
      </div>
    </Modal>
  );
}

