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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
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
  if (!isConnected) {
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
  }
  return app(req, res);
}
