import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.router';
import contractsRouter from './modules/contracts/contracts.router';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json());

  app.use('/api/auth', authRouter);
  app.use('/api/contracts', contractsRouter);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use(errorHandler);

  return app;
}
