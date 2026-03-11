import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-api-key'];
  if (key !== env.EXPIRING_SOON_API_KEY) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  next();
}
