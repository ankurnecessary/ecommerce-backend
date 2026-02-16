import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { HttpError } from '@/shared/errors/HttpError.js';

const LoginBodySchema = z.object({
  username: z.email(),
  password: z.string().min(1, 'Password is required')
});

export const validateLoginBody = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const parsed = LoginBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new HttpError(
      400,
      parsed.error.issues[0]?.message ?? 'Invalid login request body'
    );
  }

  req.body = parsed.data;
  next();
};
