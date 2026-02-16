import { TokenService } from '@/modules/auth/application/ports/TokenService.js';
import jwt from 'jsonwebtoken';
import { authConfig } from '@/modules/auth/config/auth.config.js';
import { z } from 'zod';

const RefreshTokenPayloadSchema = z.object({
  id: z.uuid(),
  email: z.email()
});

export const TokenServiceJWT: TokenService = {
  generateAccessToken(id, email) {
    return jwt.sign({ id, email }, authConfig.accessToken.secret, {
      expiresIn: Number(authConfig.accessToken.expiresIn)
    });
  },
  generateRefreshToken(id, email) {
    return jwt.sign({ id, email }, authConfig.refreshToken.secret, {
      expiresIn: Number(authConfig.refreshToken.expiresIn)
    });
  },
  verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, authConfig.refreshToken.secret, {
        algorithms: ['HS256']
      });
      const parsed = RefreshTokenPayloadSchema.safeParse(decoded);

      if (!parsed.success) return null;

      return parsed.data;
    } catch {
      return null;
    }
  }
};
