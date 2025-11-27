import prisma from '../../../shared/libs/prisma';
import { AppError } from '../../../middlewares/errorHandler';
import {
  CreateBookmarkInput,
  UpdateBookmarkInput,
  GetBookmarksQuery
} from '../schemas/bookmark.schema';
import { PaginatedResponse } from '../../../shared/types';

export class BookmarkService {

  async getBookmarks(
    userId: string,
    query: GetBookmarksQuery
  ): Promise<PaginatedResponse<any>> {
    const { search, tag, collectionId, isFavorite, isRead, limit, offset } = query;

    const where: any = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { url: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(collectionId && { collectionId }),
      ...(isFavorite !== undefined && { isFavorite }),
      ...(isRead !== undefined && { isRead }),
      ...(tag && {
        tags: {
          some: {
            tag: {
              name: { equals: tag, mode: 'insensitive' }
            }
          }
        }
      }),
    };

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true
            }
          },
          collection: {
            select: {
              id: true,
              name: true,
              emoji: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),

      prisma.bookmark.count({ where }),
    ]);

    return {
      data: bookmarks.map((b) => ({
        ...b,
        tags: this.sanitizeBookmarkTags(b.tags),
      })),
      total,
      limit,
      offset,
    };
  }

  async getBookmarkById(userId: string, bookmarkId: string) {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
      include: {
        tags: {
          include: { tag: true }
        },
        collection: {
          select: {
            id: true,
            name: true,
            emoji: true,
          }
        }
      }
    });

    if (!bookmark) {
      throw new AppError('Bookmark não encontrado', 404);
    }

    return {
      ...bookmark,
      tags: this.sanitizeBookmarkTags(bookmark.tags),
    };
  }

  async createBookmark(userId: string, data: CreateBookmarkInput) {
    // Validate collection
    if (data.collectionId) {
      const collection = await prisma.collection.findFirst({
        where: { id: data.collectionId, userId }
      });

      if (!collection) {
        throw new AppError('Coleção não encontrada', 404);
      }
    }

    // Create/find tags (case-insensitive, sem duplicatas)
    const tagIds = await this.findOrCreateTags(data.tags || [], userId);

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        title: data.title,
        url: data.url,
        description: data.description ?? null,
        image: data.image ?? null,
        isFavorite: data.favorite ?? false,
        isRead: data.read ?? false,
        userId,
        collectionId: data.collectionId ?? null,
        tags: {
          // O JEITO CORRETO DE RELACIONAR COM A PIVOT BookmarkTag
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: {
        tags: {
          include: { tag: true }
        },
        collection: {
          select: {
            id: true,
            name: true,
            emoji: true
          }
        }
      }
    });

    return {
      ...bookmark,
      tags: this.sanitizeBookmarkTags(bookmark.tags),
    };
  }

  async updateBookmark(
    userId: string,
    bookmarkId: string,
    data: UpdateBookmarkInput
  ) {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId }
    });

    if (!existingBookmark) {
      throw new AppError('Bookmark não encontrado', 404);
    }

    if (data.collectionId) {
      const collection = await prisma.collection.findFirst({
        where: { id: data.collectionId, userId }
      });

      if (!collection) {
        throw new AppError('Coleção não encontrada', 404);
      }
    }

    // Handle tags (case-insensitive, sem duplicatas)
    // Se tags foram fornecidas, criar/encontrar e atualizar
    // Se não foram fornecidas, manter as existentes
    const tagIds = data.tags !== undefined
      ? await this.findOrCreateTags(data.tags, userId)
      : undefined;

    const updateData: any = {
      ...(data.title && { title: data.title }),
      ...(data.url && { url: data.url }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.favorite !== undefined && { isFavorite: data.favorite }),
      ...(data.read !== undefined && { isRead: data.read }),
      ...(data.collectionId !== undefined && { collectionId: data.collectionId }),
    };

    const bookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        ...updateData,
        ...(tagIds !== undefined && {
          tags: {
            deleteMany: {}, // limpa pivot
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } }
            }))
          },
        }),
      },
      include: {
        tags: { include: { tag: true } },
        collection: {
          select: {
            id: true,
            name: true,
            emoji: true
          }
        }
      }
    });

    return {
      ...bookmark,
      tags: this.sanitizeBookmarkTags(bookmark.tags),
    };
  }

  async deleteBookmark(userId: string, bookmarkId: string) {
    const bookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId }
    });

    if (!bookmark) {
      throw new AppError('Bookmark não encontrado', 404);
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId }
    });

    return { message: 'Bookmark deleted successfully' };
  }

  /**
   * Normaliza e sanitiza tags do bookmark
   * Retorna array de objetos { id, name } para o frontend
   */
  sanitizeBookmarkTags(tags: any[]): Array<{ id: string; name: string }> {
    // Garante que sempre retorna um array, mesmo que vazio
    if (!Array.isArray(tags)) {
      return [];
    }
    return tags
      .filter((t) => t && t.tag && t.tag.id && t.tag.name) // remove mortos
      .map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      }));
  }

  /**
   * Normaliza nome de tag (trim, lowercase para busca)
   */
  private normalizeTagName(name: string): string {
    return name.trim().toLowerCase();
  }

  /**
   * Cria ou encontra tags, garantindo case-insensitive e sem duplicatas
   * Retorna array de IDs das tags
   */
  private async findOrCreateTags(
    tagNames: string[],
    userId: string
  ): Promise<string[]> {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }

    // Normalizar e remover duplicatas
    const normalizedNames = tagNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map((name) => ({
        original: name,
        normalized: this.normalizeTagName(name),
      }));

    // Remover duplicatas baseado no nome normalizado
    const uniqueNames = Array.from(
      new Map(
        normalizedNames.map((item) => [item.normalized, item.original])
      ).values()
    );

    const tagIds: string[] = [];

    for (const tagName of uniqueNames) {
      // Buscar tag existente (case-insensitive)
      let tag = await prisma.tag.findFirst({
        where: {
          userId,
          name: {
            equals: tagName,
            mode: 'insensitive',
          },
        },
      });

      // Se não existir, criar
      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagName.trim(), // Salvar com o nome original (preservando case)
            userId,
          },
        });
      }

      tagIds.push(tag.id);
    }

    return tagIds;
  }
  
}
