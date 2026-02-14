export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_ACCESS_TOKEN: 'Missing access token',
  INVALID_TOKEN_PAYLOAD: 'Invalid token payload',
  INVALID_OR_EXPIRED_ACCESS_TOKEN: 'Invalid or expired access token'
} as const;
