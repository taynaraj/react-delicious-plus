import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { UserController } from './controllers/user.controller';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/users/me
router.get('/me', (req, res, next) => {
  userController.getMe(req as any, res, next);
});

// PATCH /api/users/me
router.patch('/me', (req, res, next) => {
  userController.updateMe(req as any, res, next);
});

export default router;

