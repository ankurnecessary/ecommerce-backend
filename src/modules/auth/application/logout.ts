import { AuthRepository } from '../domain/AuthRepository.js';
import { TokenService } from './ports/TokenService.js';

export const logout = async (
  refreshToken: string | undefined,
  authRepo: AuthRepository,
  tokenService: TokenService
) => {
  if (!refreshToken) return;

  const payload = tokenService.verifyRefreshToken(refreshToken);

  if (!payload) return;
  await authRepo.clearRefreshTokenIfExists(payload.id);
};
