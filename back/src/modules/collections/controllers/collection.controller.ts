import { Response, NextFunction } from 'express';
import { CollectionService } from '../services/collection.service';
import { createCollectionSchema, updateCollectionSchema } from '../schemas/collection.schema';
import { AuthRequest } from '../../../middlewares/auth';

const collectionService = new CollectionService();

export class CollectionController {
  async getCollections(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const collections = await collectionService.getCollections(req.userId);
      res.json({ collections });
    } catch (error) {
      next(error);
    }
  }

  async getCollectionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const collection = await collectionService.getCollectionById(req.userId, req.params.id);
      res.json({ collection });
    } catch (error) {
      next(error);
    }
  }

  async createCollection(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = createCollectionSchema.parse(req.body);
      const collection = await collectionService.createCollection(req.userId, data);
      res.status(201).json({ collection });
    } catch (error) {
      next(error);
    }
  }

  async updateCollection(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = updateCollectionSchema.parse({ ...req.body, id: req.params.id });
      const collection = await collectionService.updateCollection(req.userId, req.params.id, data);
      res.json({ collection });
    } catch (error) {
      next(error);
    }
  }

  async deleteCollection(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const result = await collectionService.deleteCollection(req.userId, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

