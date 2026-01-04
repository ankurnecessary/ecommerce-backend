export const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ?? '5000',
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
} as const;
