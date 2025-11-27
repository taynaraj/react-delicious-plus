import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './shared/utils/logger';

// Import routes
import authRoutes from './modules/auth/routes';
import usersRoutes from './modules/users/routes';
import bookmarksRoutes from './modules/bookmarks/routes';
import collectionsRoutes from './modules/collections/routes';
import tagsRoutes from './modules/tags/routes';
import uploadRoutes from './modules/upload/routes';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = env.PORT || 3001;

app.listen(PORT, () => {
  logger.success(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📦 Environment: ${env.NODE_ENV}`);
});

