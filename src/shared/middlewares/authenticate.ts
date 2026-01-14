import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token === undefined || token === null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error !== null) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  });
};
