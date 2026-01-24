import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),

  AUTH_ACCESS_TOKEN_SECRET: required('AUTH_ACCESS_TOKEN_SECRET'),
  AUTH_REFRESH_TOKEN_SECRET: required('AUTH_REFRESH_TOKEN_SECRET'),
  AUTH_ACCESS_TOKEN_TTL: optional('AUTH_ACCESS_TOKEN_TTL', '900'), // 15m * 60s = 900s
  AUTH_REFRESH_TOKEN_TTL: optional('AUTH_REFRESH_TOKEN_TTL', '604800'), // 7d * 24h * 60m * 60s = 604800s

  DATABASE_URL: required('DATABASE_URL')
};
