import 'dotenv/config';
import serverless from 'serverless-http';
import app from './app.js';

// AWS Lambda mode
export const handler = serverless(app);

if (process.env.NODE_ENV === 'development') {
  // Local development mode
  const port = process?.env?.PORT ?? '5000';
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
