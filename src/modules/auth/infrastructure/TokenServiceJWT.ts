import { TokenService } from '../application/ports/TokenService.js';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';

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
  }
};
