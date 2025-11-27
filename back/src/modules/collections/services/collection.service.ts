import prisma from '../../../shared/libs/prisma';
import { AppError } from '../../../middlewares/errorHandler';
import { CreateCollectionInput, UpdateCollectionInput } from '../schemas/collection.schema';

export class CollectionService {
  async getCollections(userId: string) {
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return collections;
  }

  async getCollectionById(userId: string, collectionId: string) {
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
      include: {
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    return collection;
  }

  async createCollection(userId: string, data: CreateCollectionInput) {
    // Check if name already exists for this user
    const existing = await prisma.collection.findFirst({
      where: {
        name: data.name,
        userId,
      },
    });

    if (existing) {
      throw new AppError('Collection name already exists', 409);
    }

    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        emoji: data.emoji,
        userId,
      },
    });

    return collection;
  }

  async updateCollection(userId: string, collectionId: string, data: UpdateCollectionInput) {
    const existing = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!existing) {
      throw new AppError('Collection not found', 404);
    }

    // Check if new name conflicts
    if (data.name && data.name !== existing.name) {
      const nameExists = await prisma.collection.findFirst({
        where: {
          name: data.name,
          userId,
          id: { not: collectionId },
        },
      });

      if (nameExists) {
        throw new AppError('Collection name already exists', 409);
      }
    }

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.emoji !== undefined && { emoji: data.emoji }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    return collection;
  }

  async deleteCollection(userId: string, collectionId: string) {
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    // Set collectionId to null for all bookmarks in this collection
    await prisma.bookmark.updateMany({
      where: { collectionId },
      data: { collectionId: null },
    });

    // Delete collection
    await prisma.collection.delete({
      where: { id: collectionId },
    });

    return { message: 'Collection deleted successfully' };
  }
}

