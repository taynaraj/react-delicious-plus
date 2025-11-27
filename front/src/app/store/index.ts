/**
 * APP STORE
 * 
 * Configuração global do estado usando Zustand.
 * Equivalente a criar NgRx store ou services com BehaviorSubject no Angular.
 * 
 * Arquitetura:
 * - Store global para estado compartilhado entre features
 * - Slices por feature (bookmarksSlice, collectionsSlice, etc)
 * - Middlewares para persistência (salvar no localStorage/IndexedDB)
 * 
 * IMPORTANTE:
 * - Stores específicos de features podem ficar em features/{feature}/store
 * - Store global fica aqui
 * - Usar Zustand para simplicidade (alternativa seria Redux Toolkit)
 * 
 * TODO: Configurar Zustand com:
 * - create() - store base
 * - persist middleware (salvar estado no storage)
 * - slices por feature
 */

// Exemplo de estrutura (será expandido depois):
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// 
// interface AppState {
//   // estado global
// }
// 
// export const useAppStore = create<AppState>()(
//   persist(
//     (set) => ({
//       // implementação
//     }),
//     { name: 'app-store' }
//   )
// );
