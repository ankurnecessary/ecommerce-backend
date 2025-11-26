import express from 'express';
import serverless from 'serverless-http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import schema from './schema';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const server = new ApolloServer({
  schema
});

async function initApollo(): Promise<void> {
  await server.start();
  app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    }) as unknown as express.RequestHandler,
    cookieParser() as unknown as express.RequestHandler,
    express.json() as unknown as express.RequestHandler,
    expressMiddleware(server) as unknown as express.RequestHandler
  );
}
const ready = initApollo();

// For AWS lamda. It needs a handler to be exported
export const handler = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  await ready; // ensure Apollo is started before handling requests
  const expressHandler = serverless(app);
  return await expressHandler(event, context);
};

if (process.env.NODE_ENV === 'development') {
  // Local development mode
  const port = process?.env?.PORT ?? '5000';
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/graphql`);
  });
}
