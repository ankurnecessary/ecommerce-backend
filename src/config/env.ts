export const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ?? '5000',
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS
} as const;
