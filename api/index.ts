import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { errorHandler } from '../src/middleware/errorHandler';
import authRouter from '../src/modules/auth/auth.router';
import contractsRouter from '../src/modules/contracts/contracts.router';

const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'ngrok-skip-browser-warning'],
};

const app = express();
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/contracts', contractsRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

let isConnected = false;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', 'https://dataside-front.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, ngrok-skip-browser-warning');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (!isConnected) {
      await mongoose.connect(env.MONGODB_URI);
      isConnected = true;
    }
  } catch (err) {
    console.error('DB connection failed:', err);
    return res.status(503).json({ message: 'Database unavailable' });
  }

  return app(req, res);
}
