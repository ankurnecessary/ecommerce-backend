export const GLOBAL_RATE_LIMITS = {
  TIME_WINDOW: 60 * 1000, // 1 minute
  CONNECTIONS_PER_IP: 100
} as const;

export const VALIDATION_MESSAGES = {
  LOGIN_SUCCESSFUL: 'You are authenticated',
  INVALID_USERNAME_PASSWORD: 'Enter valid username and password',
  INVALID_USERNAME_EMAIL: 'Username should be a valid email address',
  INVALID_PASSWORD_LENGTH: 'Password must be at least 8 characters long',
  INVALID_PASSWORD_UPPERCASE:
    'Password must contain at least one uppercase letter',
  INVALID_PASSWORD_NUMBER: 'Password must contain at least one number',
  INVALID_PASSWORD_SPECIAL_CHARACTER:
    'Password must contain at least one special character'
};

export const REGEX = {
  UPPERCASE: /[A-Z]/,
  NUMBER: /\d/,
  SPECIAL_CHAR: /[^A-Za-z0-9]/
};
