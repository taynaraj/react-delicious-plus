import path from 'path';
import { AppError } from '../../../middlewares/errorHandler';

export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new AppError('Nenhum arquivo fornecido', 400);
    }

    // Validate file type
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new AppError('Tipo de arquivo inválido. Apenas PNG, JPG, JPEG e WEBP são permitidos.', 400);
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new AppError('O tamanho do arquivo excede o limite de 2MB', 400);
    }

    // Return URL path
    const url = `/uploads/${file.filename}`;

    return { url };
  }
}

