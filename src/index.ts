import 'dotenv/config';
import serverless from 'serverless-http';
import app from './app.js';

// AWS Lambda mode
export const handler = serverless(app);
