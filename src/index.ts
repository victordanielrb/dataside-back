import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.router';
import contractsRouter from './modules/contracts/contracts.router';

const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
};

async function main() {
  await connectDB();

  const app = express();
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
  app.use(express.json());

  app.use('/api/auth', authRouter);
  app.use('/api/contracts', contractsRouter);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use(errorHandler);

  app.listen(Number(env.PORT), () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
