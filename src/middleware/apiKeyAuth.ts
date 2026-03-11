import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const headerValue = req.headers['x-api-key'];
  const key = Array.isArray(headerValue) ? headerValue[0] : headerValue;

  if (!key || key.trim() !== env.EXPIRING_SOON_API_KEY.trim()) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  next();
}
