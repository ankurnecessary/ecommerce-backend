import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@/shared/errors/HttpError.js';
import { ERROR_CODES, VALIDATION_MESSAGES } from '@/shared/config/constants.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null
      }
    });
  }

  // fallback for unknown errors
  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: VALIDATION_MESSAGES.INTERNAL_SERVER_ERROR,
      details: null
    }
  });
}
