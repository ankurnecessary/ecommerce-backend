import jwt from 'jsonwebtoken';
import { HttpError } from '@/shared/errors/HttpError.js';
import { authConfig } from '@/modules/auth/config/auth.config.js';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ERROR_CODES, VALIDATION_MESSAGES } from '@/shared/config/constants.js';

const AccessTokenPayloadSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  iat: z.number(),
  exp: z.number()
});

type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw new HttpError(
      401,
      VALIDATION_MESSAGES.MISSING_ACCESS_TOKEN,
      ERROR_CODES.MISSING_ACCESS_TOKEN
    );
  }

  try {
    const decoded = jwt.verify(accessToken, authConfig.accessToken.secret, {
      algorithms: ['HS256']
    });
    const parsed = AccessTokenPayloadSchema.safeParse(decoded);

    if (!parsed.success) {
      throw new HttpError(
        401,
        VALIDATION_MESSAGES.INVALID_TOKEN_PAYLOAD,
        ERROR_CODES.INVALID_TOKEN_PAYLOAD
      );
    }
    const payload: AccessTokenPayload = parsed.data;
    req.user = { id: payload.id, email: payload.email };

    next();
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(
      401,
      VALIDATION_MESSAGES.INVALID_OR_EXPIRED_ACCESS_TOKEN,
      ERROR_CODES.INVALID_OR_EXPIRED_ACCESS_TOKEN
    );
  }
}
