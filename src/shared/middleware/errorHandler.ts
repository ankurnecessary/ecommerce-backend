import { Request, Response } from 'express';
import { HttpError } from '../errors/HttpError.js';

export function errorHandler(err: Error, req: Request, res: Response) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // fallback for unknown errors
  console.error(err);

  return res.status(500).json({
    message: 'Internal server error'
  });
}
