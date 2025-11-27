import { createRepository, IRepository } from '@shared/libs/storage/repository';
import { db } from '@shared/libs/storage/database';
import type { Tag } from '@shared/types/tag';
import { bookmarksRepository } from '@features/bookmarks/services/bookmarks.repository';

const baseRepository = createRepository<Tag>(db.tags);

export const tagsRepository: IRepository<Tag> & {
  /**
   * Busca tags por nome
   */
  searchByName(query: string): Promise<Tag[]>;
  
  /**
   * Conta quantos bookmarks usam uma tag
   */
  countBookmarks(tagName: string): Promise<number>;
} = {
  // Herdar métodos do baseRepository
  ...baseRepository,

  /**
   * Busca tags por nome
   * 
   * Busca case-insensitive no nome da tag.
   */
  async searchByName(query: string): Promise<Tag[]> {
    const allTags = await db.tags.toArray();
    const lowerQuery = query.toLowerCase();

    return allTags.filter((tag) =>
      tag.name.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Conta quantos bookmarks usam uma tag
   * 
   * Útil para exibir contadores na UI.
   */
  async countBookmarks(tagName: string): Promise<number> {
    const bookmarks = await bookmarksRepository.findByTag(tagName);
    return bookmarks.length;
  },
};

