import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { CollectionController } from './controllers/collection.controller';

const router = Router();
const collectionController = new CollectionController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/collections
router.get('/', (req, res, next) => {
  collectionController.getCollections(req as any, res, next);
});

// GET /api/collections/:id
router.get('/:id', (req, res, next) => {
  collectionController.getCollectionById(req as any, res, next);
});

// POST /api/collections
router.post('/', (req, res, next) => {
  collectionController.createCollection(req as any, res, next);
});

// PATCH /api/collections/:id
router.patch('/:id', (req, res, next) => {
  collectionController.updateCollection(req as any, res, next);
});

// DELETE /api/collections/:id
router.delete('/:id', (req, res, next) => {
  collectionController.deleteCollection(req as any, res, next);
});

export default router;

