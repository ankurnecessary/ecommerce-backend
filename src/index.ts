import 'dotenv/config';
import serverless from 'serverless-http';
import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

// AWS Lambda mode
export const handler = serverless(app);

if (config.NODE_ENV === 'development') {
  // Local development mode
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
