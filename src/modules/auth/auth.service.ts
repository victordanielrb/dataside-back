import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../../models/AdminUser';
import { env } from '../../config/env';

export async function login(email: string, password: string) {
  const user = await AdminUser.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const id = (user._id as { toString(): string }).toString();

  const token = jwt.sign(
    { sub: id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, user: { id, email: user.email } };
}
