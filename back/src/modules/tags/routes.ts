import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { TagController } from './controllers/tag.controller';

const router = Router();
const tagController = new TagController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/tags
router.get('/', (req, res, next) => {
  tagController.getTags(req as any, res, next);
});

// GET /api/tags/:id
router.get('/:id', (req, res, next) => {
  tagController.getTagById(req as any, res, next);
});

// POST /api/tags
router.post('/', (req, res, next) => {
  tagController.createTag(req as any, res, next);
});

// PATCH /api/tags/:id
router.patch('/:id', (req, res, next) => {
  tagController.updateTag(req as any, res, next);
});

// DELETE /api/tags/:id
router.delete('/:id', (req, res, next) => {
  tagController.deleteTag(req as any, res, next);
});

export default router;

