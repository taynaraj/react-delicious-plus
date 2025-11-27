import { Response, NextFunction } from 'express';
import { TagService } from '../services/tag.service';
import { createTagSchema, updateTagSchema } from '../schemas/tag.schema';
import { AuthRequest } from '../../../middlewares/auth';

const tagService = new TagService();

export class TagController {
  async getTags(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const tags = await tagService.getTags(req.userId);
      res.json({ tags });
    } catch (error) {
      next(error);
    }
  }

  async getTagById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const tag = await tagService.getTagById(req.userId, req.params.id);
      res.json({ tag });
    } catch (error) {
      next(error);
    }
  }

  async createTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = createTagSchema.parse(req.body);
      const tag = await tagService.createTag(req.userId, data);
      res.status(201).json({ tag });
    } catch (error) {
      next(error);
    }
  }

  async updateTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = updateTagSchema.parse({ ...req.body, id: req.params.id });
      const tag = await tagService.updateTag(req.userId, req.params.id, data);
      res.json({ tag });
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const result = await tagService.deleteTag(req.userId, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

