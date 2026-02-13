import type { Request, Response } from 'express';
import { login } from './application/login.js';
import { refresh } from './application/refresh.js';
import { UserRepositoryPrisma } from '@/modules/user/infrastructure/UserRepositoryPrisma.js';
import { AuthRepositoryPrisma } from './infrastructure/AuthRepositoryPrisma.js';
import { PasswordHasherBcrypt } from './infrastructure/PasswordHasherBcrypt.js';
import { TokenServiceJWT } from './infrastructure/TokenServiceJWT.js';
import { authConfig } from './config/auth.config.js';
import { logout } from './application/logout.js';

// curl -i
//  -X POST http://localhost:5000/api/v1/auth/login
//  -H "Content-Type: application/json"
//  -d '{"username": "xxxx@xxxxx.com", "password": "xxxxxx"}'
//  -c cookies.txt
export const loginController = async (req: Request, res: Response) => {
  const { username: email, password } = req.body;

  const result = await login(
    email,
    password,
    UserRepositoryPrisma,
    AuthRepositoryPrisma,
    PasswordHasherBcrypt,
    TokenServiceJWT
  );

  // For swagger
  const mode = req.query.mode;
  if (mode === 'json') {
    return res.json(result);
  }

  // Set HTTP-only cookies with SameSite protection
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: authConfig.nodeEnv === 'production', // HTTPS only in production
    sameSite: 'lax', // [ ]: I will check it later when we will be interacting with the actual frontend
    maxAge: Number(authConfig.accessToken.expiresIn) * 1000 // 15 minutes
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: authConfig.nodeEnv === 'production', // HTTPS only in production
    sameSite: 'lax', // [ ]: I will check it later when we will be interacting with the actual frontend
    maxAge: Number(authConfig.refreshToken.expiresIn) * 1000 // 7 days
  });

  // Return user data without tokens
  res.status(200).json({
    id: result.id,
    username: result.username
  });
};

// curl -i
//  -X POST http://localhost:5000/api/v1/auth/logout
//  -b cookies.txt
export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  await logout(refreshToken, AuthRepositoryPrisma, TokenServiceJWT);

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: authConfig.nodeEnv === 'production',
    sameSite: 'lax'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: authConfig.nodeEnv === 'production',
    sameSite: 'lax'
  });

  res.status(200).json({
    message: 'Logged out successfully'
  });
};

// curl -i
//  -X POST http://localhost:5000/api/v1/auth/refresh
//  -b cookies.txt
//  -c cookies.txt
export const refreshController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  const result = await refresh(
    refreshToken,
    AuthRepositoryPrisma,
    TokenServiceJWT
  );

  if (!result) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: authConfig.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: Number(authConfig.accessToken.expiresIn) * 1000
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: authConfig.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: Number(authConfig.refreshToken.expiresIn) * 1000
  });

  return res.status(200).json({ message: 'Tokens refreshed' });
};
