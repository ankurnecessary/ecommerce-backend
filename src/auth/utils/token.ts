import type { User } from '../types.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

export function generateAccessToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.REFRESH_TOKEN_SECRET
  );
}
