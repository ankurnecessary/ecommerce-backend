import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '100kb ' }));

// Parse application/json
app.use(express.json({ limit: '100kb' }));

// To  handle CORS error in the browser
app.use(
  cors({
    origin: ['http://localhost:5000'], // allowed domains
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
    credentials: true // allow cookies/auth headers
  })
);

// Routes
app.use('/api', apiRouter);

export default app;
