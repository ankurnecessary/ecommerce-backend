import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
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
    message: {
      errors: [options.message ?? 'Too many requests, please try again later.']
    },
    keyGenerator: (req) => ipKeyGenerator(req.ip ?? '127.0.0.1', 56)
  });
};
