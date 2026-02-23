import 'dotenv/config';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Ecommerce APIs',
      version: '1.0.0',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [{ url: `${process.env.OPENAPI_SERVER_URL || ''}` }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorObject: {
          type: 'object',
          required: ['code', 'message', 'details'],
          properties: {
            code: {
              type: 'string',
              example: 'INVALID_CREDENTIALS'
            },
            message: {
              type: 'string',
              example: 'Invalid credentials'
            },
            details: {
              type: 'object',
              nullable: true,
              oneOf: [
                { type: 'array', items: { type: 'object' } },
                { type: 'object' }
              ]
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              $ref: '#/components/schemas/ErrorObject'
            }
          }
        },
        ValidationErrorDetail: {
          type: 'object',
          required: ['field', 'message', 'code'],
          properties: {
            field: {
              type: 'string',
              example: 'username'
            },
            message: {
              type: 'string',
              example: 'Invalid email address'
            },
            code: {
              type: 'string',
              example: 'invalid_format'
            }
          }
        },
        ValidationErrorResponse: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              required: ['code', 'message', 'details'],
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Invalid email address'
                },
                details: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ValidationErrorDetail'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routers/*.ts', './src/modules/**/*.routes.ts']
};

export default swaggerJSDoc(options);
