import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Ecommerce APIs',
      version: '1.0.0'
    },
    servers: [{ url: `http://localhost:${process.env.PORT ?? 5000}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routers/*.ts', './src/modules/**/*.routes.ts']
};

export default swaggerJSDoc(options);
