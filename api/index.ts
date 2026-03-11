import { createApp } from '../src/server';
import { connectDB } from '../src/config/db';

const app = createApp();

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
