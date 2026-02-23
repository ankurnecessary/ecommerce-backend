import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { HttpError } from '@/shared/errors/HttpError.js';
import { ERROR_CODES } from '@/shared/config/constants.js';

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
    const details = parsed.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message,
      code: issue.code
    }));

    throw new HttpError(
      400,
      parsed.error.issues[0]?.message ?? 'Invalid login request body',
      ERROR_CODES.VALIDATION_ERROR,
      details
    );
  }

  req.body = parsed.data;
  next();
};
