import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const ORIGIN = 'https://dataside-front.vercel.app';

const corsOptions: cors.CorsOptions = {
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'ngrok-skip-browser-warning'],
};

let app: express.Express | null = null;
let isConnected = false;

function getApp(): express.Express {
  if (app) return app;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { errorHandler } = require('../src/middleware/errorHandler');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const authRouter = require('../src/modules/auth/auth.router').default;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const contractsRouter = require('../src/modules/contracts/contracts.router').default;

  app = express();
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use('/api/auth', authRouter);
  app.use('/api/contracts', contractsRouter);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use(errorHandler);

  return app;
}

export default async function handler(req: any, res: any) {
  // Always set CORS headers before anything else
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, ngrok-skip-browser-warning');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../src/config/env');

    if (!isConnected) {
      await mongoose.connect(env.MONGODB_URI);
      isConnected = true;
    }

    return getApp()(req, res);
  } catch (err: any) {
    console.error('Handler error:', err);
    return res.status(503).json({ message: err.message || 'Service unavailable' });
  }
}
