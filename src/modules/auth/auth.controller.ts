import { Request, Response, NextFunction } from 'express';
import { loginSchema } from './auth.schema';
import { login } from './auth.service';

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = parsed.data;
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid credentials') {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    next(err);
  }
}
