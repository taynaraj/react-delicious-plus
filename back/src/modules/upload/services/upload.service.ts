import path from 'path';
import { AppError } from '../../../middlewares/errorHandler';

export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new AppError('No file provided', 400);
    }

    // Validate file type
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new AppError('Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed.', 400);
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new AppError('File size exceeds 2MB limit', 400);
    }

    // Return URL path
    const url = `/uploads/${file.filename}`;

    return { url };
  }
}

