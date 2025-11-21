import express from 'express';
import serverless from 'serverless-http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const server = new ApolloServer({
  typeDefs: `
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hello World!'
    }
  }
});

async function startServer(): Promise<void> {
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
  if (process.env.NODE_ENV === 'development') {
    // Local development mode
    const port = process?.env?.PORT ?? '5000';
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}/graphql`);
    });
  } else {
    // AWS Lambda mode
    module.exports.handler = serverless(app);
  }
}

startServer().catch((error) => {
  console.error({ error });
});
