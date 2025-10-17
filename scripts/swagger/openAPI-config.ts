import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Ecommerce APIs',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:5000/api' }]
  },
  apis: ['./routes/*.js']
};

export default swaggerJSDoc(options);
