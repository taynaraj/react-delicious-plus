import { createRepository, IRepository } from '@shared/libs/storage/repository';
import { db } from '@shared/libs/storage/database';
import type { Bookmark } from '@shared/types/bookmark';

const baseRepository = createRepository<Bookmark>(db.bookmarks);

export const bookmarksRepository: IRepository<Bookmark> & {
  /**
   * Busca bookmarks por tag
   */
  findByTag(tag: string): Promise<Bookmark[]>;
  
  /**
   * Busca bookmarks por coleção
   */
  findByCollection(collectionId: string): Promise<Bookmark[]>;
  
  /**
   * Busca bookmarks favoritos
   */
  findFavorites(): Promise<Bookmark[]>;
  
  /**
   * Busca bookmarks não lidos
   */
  findUnread(): Promise<Bookmark[]>;
  
  /**
   * Busca bookmarks usando texto de busca (title, url, description)
   */
  search(query: string): Promise<Bookmark[]>;
} = {
  ...baseRepository,

  async findByTag(tag: string): Promise<Bookmark[]> {
    return db.bookmarks
      .where('tags')
      .anyOf([tag])
      .toArray();
  },

  /**
   * Busca bookmarks por coleção
   */
  async findByCollection(collectionId: string): Promise<Bookmark[]> {
    return db.bookmarks
      .where('collectionId')
      .equals(collectionId)
      .toArray();
  },

  /**
   * Busca bookmarks favoritos
   */
  async findFavorites(): Promise<Bookmark[]> {
    return db.bookmarks
      .filter((bookmark) => bookmark.favorite === true)
      .toArray();
  },

  /**
   * Busca bookmarks não lidos
   */
  async findUnread(): Promise<Bookmark[]> {
    return db.bookmarks
      .filter((bookmark) => bookmark.read === false)
      .toArray();
  },


  async search(query: string): Promise<Bookmark[]> {
    const allBookmarks = await db.bookmarks.toArray();
    const lowerQuery = query.toLowerCase();

    return allBookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(lowerQuery) ||
        bookmark.url.toLowerCase().includes(lowerQuery) ||
        (bookmark.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  },
};
