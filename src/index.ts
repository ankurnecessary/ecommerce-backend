import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import indexRoutes from './routes/index.js';
import categoriesRoutes from './routes/categories.js';

const app = express();

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());

// To  handle CORS error in the browser
app.use((req: Request, res: Response, next: NextFunction): void => {
  // We can set these headers conditionally, if we want our APIs to be accessed from multiple domains.
  // But right now we are entertaining requests from any domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', indexRoutes);
app.use('/api/categories', categoriesRoutes);

// AWS Lambda mode
export const handler = serverless(app);

if (process.env.NODE_ENV === 'development') {
  // Local development mode
  const port = process?.env?.PORT ?? '5000';
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
