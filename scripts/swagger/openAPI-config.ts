import swaggerJSDoc from 'swagger-jsdoc';
import '../../src/config/env';
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Ecommerce APIs',
      version: '1.0.0'
    },
    servers: [{ url: `http://localhost:${process.env.PORT}/api` }]
  },
  apis: ['./src/routes/*.ts']
};

export default swaggerJSDoc(options);
