import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { Input } from './Input';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export interface EmojiPickerProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

// Lista de emojis populares
const POPULAR_EMOJIS = [
  '📁', '📚', '⭐', '🚀', '💡', '🔥', '🔖', '🧩', '📌', '📎', '📝', '💜', '💛', '💙', '❤️', '💻', '📱',
  '🎨', '🎯', '🎪', '🎭', '🎬', '🎮', '🎲', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎼',
  '🏠', '🏢', '🏫', '🏭', '🏪', '🏬', '🏰', '🏯', '⛪', '🕌', '🕍', '🛕', '🏛️', '💒', '🏩',
  '📂', '📋', '📊', '📈', '📉', '📄', '📃', '📑', '📜', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙',
  '🎯', '🎪', '🎭', '🎬', '🎮', '🎲', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎼','🎁',
  '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜',
];

/**
 * EmojiPicker Component
 * 
 * Popover premium para seleção de emojis.
 */
export function EmojiPicker({
  open,
  anchorRef,
  onSelect,
  onClose,
}: EmojiPickerProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });


  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const filteredEmojis = useMemo(() => {
    return POPULAR_EMOJIS;
  }, []);

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const popoverWidth = 240;
      const popoverHeight = 240;

      let top = rect.bottom + scrollY + 8;
      let left = rect.left + scrollX;

      if (left + popoverWidth > window.innerWidth + scrollX) {
        left = window.innerWidth + scrollX - popoverWidth - 8;
      }

      if (left < scrollX) {
        left = scrollX + 8;
      }

      if (top + popoverHeight > window.innerHeight + scrollY) {
        top = rect.top + scrollY - popoverHeight - 8;
        if (top < scrollY) {
          top = scrollY + 8;
        }
      }

      setPosition({ top, left });
    }
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useClickOutside(popoverRef, (event) => {
    if (open && anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
      onClose();
    }
  });

  useEffect(() => {
    if (!open) {
      setLocalSearchQuery('');
    }
  }, [open]);

  if (!open) return null;

  const popoverContent = (
    <div
      ref={popoverRef}
      className={clsx(
        'fixed z-50 w-60 rounded-lg',
        'bg-white dark:bg-neutral-900',
        'border border-[rgba(0,0,0,0.06)] dark:border-neutral-800/50',
        'shadow-xl',
        'p-2',
        'max-h-60 overflow-y-auto scrollbar-thin'
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
      role="dialog"
      aria-label="Selecionar emoji"
      aria-expanded={open}
    >
      <div className="mb-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" strokeWidth={1.7} />
          <Input
            type="text"
            placeholder="Buscar emoji..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm rounded-lg"
            autoFocus
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {filteredEmojis.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            type="button"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className={clsx(
              'w-9 h-9 flex items-center justify-center',
              'rounded-lg',
              'text-xl',
              'hover:bg-neutral-100 dark:hover:bg-neutral-800',
              'transition-colors duration-150',
              'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50'
            )}
            aria-label={`Selecionar emoji ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  return createPortal(popoverContent, document.body);
}

