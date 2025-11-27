import prisma from '../../../shared/libs/prisma';
import { AppError } from '../../../middlewares/errorHandler';
import { CreateTagInput, UpdateTagInput } from '../schemas/tag.schema';

export class TagService {
  async getTags(userId: string) {
    const tags = await prisma.tag.findMany({
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

    return tags;
  }

  async getTagById(userId: string, tagId: string) {
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
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

    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    return tag;
  }

  async createTag(userId: string, data: CreateTagInput) {
    // Check if tag already exists for this user (case-insensitive)
    const existing = await prisma.tag.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
        userId,
      },
    });

    if (existing) {
      throw new AppError('Já existe uma tag com este nome', 409);
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name.trim(),
        userId,
      },
    });

    return tag;
  }

  async updateTag(userId: string, tagId: string, data: UpdateTagInput) {
    const existing = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });

    if (!existing) {
      throw new AppError('Tag não encontrada', 404);
    }

    // Check if new name conflicts (case-insensitive)
    if (data.name && data.name.trim() !== existing.name) {
      const nameExists = await prisma.tag.findFirst({
        where: {
          name: {
            equals: data.name.trim(),
            mode: 'insensitive',
          },
          userId,
          id: { not: tagId },
        },
      });

      if (nameExists) {
        throw new AppError('Já existe uma tag com este nome', 409);
      }
    }

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        ...(data.name && { name: data.name.trim() }),
      },
    });

    return tag;
  }

  async deleteTag(userId: string, tagId: string) {
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
      include: {
        bookmarks: {
          select: {
            bookmarkId: true,
          },
        },
      },
    });

    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    // Disconnect tag from all bookmarks
    for (const bookmarkTag of tag.bookmarks) {
      await prisma.bookmark.update({
        where: { id: bookmarkTag.bookmarkId },
        data: {
          tags: {
            delete: {
              bookmarkId_tagId: {
                bookmarkId: bookmarkTag.bookmarkId,
                tagId: tagId,
              },
            },
          },
        },
      });
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id: tagId },
    });

    return { message: 'Tag deleted successfully' };
  }
}

