import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', (req, res, next) => {
  authController.register(req, res, next);
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  authController.login(req, res, next);
});

// GET /api/auth/me (protected)
router.get('/me', authMiddleware, (req, res, next) => {
  authController.me(req as any, res, next);
});

export default router;

