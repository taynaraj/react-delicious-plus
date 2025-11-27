/**
 * SHARED SERVICES
 * 
 * Serviços compartilhados entre features (não relacionados a uma feature específica).
 * Em Angular, seriam services injetados via DI no módulo raiz.
 * 
 * IMPORTANTE: 
 * - Services específicos de uma feature ficam em features/{feature}/services
 * - Services globais ficam aqui
 */

export { default as apiClient } from './apiClient';
export { authService } from './authService';
export { bookmarksService } from './bookmarksService';
export { uploadImage } from './uploadService';
