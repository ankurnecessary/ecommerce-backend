import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import apiRouter from './api/router.js';
import { config } from './config/env.js';
import { createRateLimiter } from './shared/middlewares/rate-limiter.js';
import { GLOBAL_RATE_LIMITS } from './config/constants.js';

export function createApp(): Express {
  const app = express();

  // Parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true, limit: '100kb ' }));

  // Parse application/json
  app.use(express.json({ limit: '100kb' }));

  // To  handle CORS error in the browser
  const origins = config.CORS_ORIGINS?.split(',') ?? [];
  app.use(
    cors({
      // [x]: Make these domains configurable as per NODE_ENV value
      origin: origins, // allowed domains
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
      credentials: true // allow cookies/auth headers
    })
  );

  // Routes
  // [x]: Add global rate-limiter
  // [x]: Testing global rate-limiter
  // [ ]: Does createApp() function works in production or not?
  // [x]: Also introduce a config folder for constants and environment variables
  // [x]: Add rate-limit numbers in config file so that actual implimentaion and test cases will run against the same numbers.
  // [ ]: Write a global error-handler
  const globalLimiter = createRateLimiter({
    windowMs: GLOBAL_RATE_LIMITS.TIME_WINDOW,
    max: GLOBAL_RATE_LIMITS.CONNECTIONS_PER_IP
  });
  app.use('/api', globalLimiter, apiRouter);

  return app;
}
