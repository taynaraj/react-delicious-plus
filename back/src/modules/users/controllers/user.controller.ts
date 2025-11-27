import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { updateUserSchema } from '../schemas/user.schema';
import { AuthRequest } from '../../../middlewares/auth';

const userService = new UserService();

export class UserController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = await userService.getMe(req.userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = updateUserSchema.parse(req.body);
      const user = await userService.updateMe(req.userId, data);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}

