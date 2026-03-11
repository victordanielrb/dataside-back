import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.router';
import contractsRouter from './modules/contracts/contracts.router';

const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'ngrok-skip-browser-warning'],
};

export function createApp() {
  const app = express();

  // Handle OPTIONS preflight explicitly before all other middleware
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
  app.use(express.json());

  app.use('/api/auth', authRouter);
  app.use('/api/contracts', contractsRouter);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use(errorHandler);

  return app;
}
