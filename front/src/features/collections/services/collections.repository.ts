
import { createRepository, IRepository } from '@shared/libs/storage/repository';
import { db } from '@shared/libs/storage/database';
import type { Collection } from '@shared/types/collection';
import { bookmarksRepository } from '@features/bookmarks/services/bookmarks.repository';

const baseRepository = createRepository<Collection>(db.collections);

export const collectionsRepository: IRepository<Collection> & {
  searchByName(query: string): Promise<Collection[]>;
  
  countBookmarks(collectionId: string): Promise<number>;
} = {
  ...baseRepository,

  async searchByName(query: string): Promise<Collection[]> {
    const allCollections = await db.collections.toArray();
    const lowerQuery = query.toLowerCase();

    return allCollections.filter((collection) =>
      collection.name.toLowerCase().includes(lowerQuery)
    );
  },


  async countBookmarks(collectionId: string): Promise<number> {
    const bookmarks = await bookmarksRepository.findByCollection(collectionId);
    return bookmarks.length;
  },
};

