import express from 'express';
import cors from 'cors';
import apiRouter from './api/router.js';
import { config } from './config/env.js';

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
// [ ]: Add global rate-limiter
// [x]: Also introduce a config folder for constants and environment variables
app.use('/api', apiRouter);

export default app;
