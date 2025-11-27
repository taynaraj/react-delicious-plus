import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { UploadController } from './controllers/upload.controller';
import { upload } from './config/multer.config';

const router = Router();
const uploadController = new UploadController();

// All routes require authentication
router.use(authMiddleware);

// POST /api/upload/image
router.post('/image', upload.single('image'), (req, res, next) => {
  uploadController.uploadImage(req as any, res, next);
});

export default router;

