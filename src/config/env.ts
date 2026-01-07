export const config: Record<string, string> = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? '5000',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? '',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? '',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? ''
} as const;
