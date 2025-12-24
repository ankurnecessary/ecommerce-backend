import rateLimit from 'express-rate-limit';
import type { RateLimitRequestHandler } from 'express-rate-limit';

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
}): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: options.message ?? 'Too many requests, please try again later.'
  });
};
