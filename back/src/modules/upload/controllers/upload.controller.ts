import { Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { AuthRequest } from '../../../middlewares/auth';

const uploadService = new UploadService();

export class UploadController {
  async uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const result = await uploadService.uploadImage(file);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

