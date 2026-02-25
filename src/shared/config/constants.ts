export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_ACCESS_TOKEN: 'Missing access token',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_TOKEN_PAYLOAD: 'Invalid token payload',
  INVALID_OR_EXPIRED_ACCESS_TOKEN: 'Invalid or expired access token',
  INTERNAL_SERVER_ERROR: 'Internal server error'
} as const;

export type ErrorMessages =
  (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  MISSING_ACCESS_TOKEN: 'MISSING_ACCESS_TOKEN',
  INVALID_TOKEN_PAYLOAD: 'INVALID_TOKEN_PAYLOAD',
  INVALID_OR_EXPIRED_ACCESS_TOKEN: 'INVALID_OR_EXPIRED_ACCESS_TOKEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
