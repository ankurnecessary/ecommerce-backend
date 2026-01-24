import type { Request, Response } from 'express';
import { login } from './application/login.js';
import { UserRepositoryPrisma } from '../user/infrastructure/UserRepositoryPrisma.js';
import { AuthRepositoryPrisma } from './infrastructure/AuthRepositoryPrisma.js';
import { PasswordHasherBcrypt } from './infrastructure/PasswordHasherBcrypt.js';
import { TokenServiceJWT } from './infrastructure/TokenServiceJWT.js';

// curl -i -X POST http://localhost:5000/api/v1/auth/login
//  -H "Content-Type: application/json"
//  -d '{"username": "hello@test.com", "password": "sssssss"}'
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

  res.status(200).json(result);
};
