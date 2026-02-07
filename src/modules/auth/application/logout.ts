import { AuthRepository } from '@/modules/auth/domain/AuthRepository.js';
import { TokenService } from './ports/TokenService.js';

export const logout = async (
  refreshToken: string | undefined,
  authRepo: Pick<AuthRepository, 'clearRefreshTokenIfExists'>,
  tokenService: Pick<TokenService, 'verifyRefreshToken'>
) => {
  if (!refreshToken) return;

  const payload = tokenService.verifyRefreshToken(refreshToken);

  if (!payload) return;
  await authRepo.clearRefreshTokenIfExists(payload.id);
};
