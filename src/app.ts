import express from 'express';
import cors from 'cors';
import v1Routes from './routers/v1.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import { env } from './shared/config/env.js';

const app = express();
const allowedOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '100kb ' }));

// Parse application/json
app.use(express.json({ limit: '100kb' }));

// To  handle CORS error in the browser
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser and same-origin requests with no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'], // allowed headers
    credentials: true // allow cookies/auth headers
  })
);

app.use(cookieParser());
// Routes
app.use('/api/v1', v1Routes);
// app.use('/api/v2', v2Routes);

app.use(errorHandler);

export default app;
