/**
 * Run once to create the initial admin user:
 *   ADMIN_EMAIL=admin@teste.com ADMIN_PASSWORD=admin123456 npx tsx src/scripts/seed-admin.ts
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { AdminUser } from '../models/AdminUser';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.');
  process.exit(1);
}

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  const hash = await bcrypt.hash(password!, 12);
  try {
    await AdminUser.create({ email, password_hash: hash });
    console.log(`✅ Admin user created: ${email}`);
  } catch (err: unknown) {
    const message = (err as { message?: string })?.message ?? 'Unknown error';
    console.error('Error creating admin:', message);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
