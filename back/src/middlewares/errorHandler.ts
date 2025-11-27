import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../shared/utils/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    logger.error('Validation error:', errors);
    return res.status(400).json({
      error: errors.join(', '),
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error('Prisma error:', err.code, err.meta);

    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Duplicate entry. This record already exists.',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found.',
      });
    }

    return res.status(400).json({
      error: 'Database error occurred.',
    });
  }

  // AppError (custom errors)
  if (err instanceof AppError) {
    logger.error('App error:', err.message);
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Unknown errors
  logger.error('Unknown error:', err);
  return res.status(500).json({
    error: 'Internal server error',
  });
};

