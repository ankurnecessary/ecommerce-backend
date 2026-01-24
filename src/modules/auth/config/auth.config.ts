import { env } from '../../../shared/config/env.js';

export const authConfig = {
  accessToken: {
    secret: env.AUTH_ACCESS_TOKEN_SECRET,
    expiresIn: env.AUTH_ACCESS_TOKEN_TTL
  },
  refreshToken: {
    secret: env.AUTH_REFRESH_TOKEN_SECRET,
    expiresIn: env.AUTH_REFRESH_TOKEN_TTL
  }
};
