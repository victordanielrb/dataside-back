import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
  PORT: z.string().default('3001'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32).optional(),
  EXPIRING_SOON_API_KEY: z.string().min(1).optional(),
  FRONTEND_URL: z.string().url().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
}

export const env = parsed.data;
