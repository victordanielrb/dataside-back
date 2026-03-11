import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
  PORT: z.string().default('3001'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  EXPIRING_SOON_API_KEY: z.string().min(16),
  FRONTEND_URL: z.string().url(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
