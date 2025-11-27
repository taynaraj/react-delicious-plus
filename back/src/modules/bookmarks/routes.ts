import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { BookmarkController } from './controllers/bookmark.controller';

const router = Router();
const bookmarkController = new BookmarkController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/bookmarks
router.get('/', (req, res, next) => {
  bookmarkController.getBookmarks(req as any, res, next);
});

// GET /api/bookmarks/:id
router.get('/:id', (req, res, next) => {
  bookmarkController.getBookmarkById(req as any, res, next);
});

// POST /api/bookmarks
router.post('/', (req, res, next) => {
  bookmarkController.createBookmark(req as any, res, next);
});

// PATCH /api/bookmarks/:id
router.patch('/:id', (req, res, next) => {
  bookmarkController.updateBookmark(req as any, res, next);
});

// DELETE /api/bookmarks/:id
router.delete('/:id', (req, res, next) => {
  bookmarkController.deleteBookmark(req as any, res, next);
});

export default router;

