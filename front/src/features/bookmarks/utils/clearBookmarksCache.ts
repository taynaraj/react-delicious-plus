
export function clearBookmarksCache(): void {
  try {
    // Limpar localStorage do Zustand
    localStorage.removeItem('bookmarks-store');
    
    // Limpar IndexedDB (Dexie) se existir
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const deleteDB = indexedDB.deleteDatabase('DeliciousPlusDB');
      deleteDB.onsuccess = () => {
        console.log('IndexedDB limpo com sucesso');
      };
      deleteDB.onerror = () => {
        console.warn('Erro ao limpar IndexedDB:', deleteDB.error);
      };
    }
    
    console.log('Cache de bookmarks limpo');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
}

