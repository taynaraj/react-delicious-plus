import { Request, Response, NextFunction } from 'express';
import { BookmarkService } from '../services/bookmark.service';
import { createBookmarkSchema, updateBookmarkSchema, getBookmarksQuerySchema } from '../schemas/bookmark.schema';
import { AuthRequest } from '../../../middlewares/auth';

const bookmarkService = new BookmarkService();

export class BookmarkController {
  async getBookmarks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const query = getBookmarksQuerySchema.parse(req.query);
      const result = await bookmarkService.getBookmarks(req.userId, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBookmarkById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const bookmark = await bookmarkService.getBookmarkById(req.userId, req.params.id);
      res.json({ bookmark });
    } catch (error) {
      next(error);
    }
  }

  async createBookmark(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = createBookmarkSchema.parse(req.body);
      const bookmark = await bookmarkService.createBookmark(req.userId, data);
      res.status(201).json({ bookmark });
    } catch (error) {
      next(error);
    }
  }

  async updateBookmark(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = updateBookmarkSchema.parse({ ...req.body, id: req.params.id });
      const bookmark = await bookmarkService.updateBookmark(req.userId, req.params.id, data);
      res.json({ bookmark });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmark(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const result = await bookmarkService.deleteBookmark(req.userId, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

