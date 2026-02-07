import { AuthRepository } from '@/modules/auth/domain/AuthRepository.js';
import { TokenService } from '@/modules/auth/application/ports/TokenService.js';

export const refresh = async (
  refreshToken: string | undefined,
  authRepo: Pick<
    AuthRepository,
    'saveRefreshToken' | 'getRefreshTokenByUserId'
  >,
  tokenService: TokenService
) => {
  if (!refreshToken) return null;

  const payload = tokenService.verifyRefreshToken(refreshToken);
  if (!payload) return null;

  const storedRefreshToken = await authRepo.getRefreshTokenByUserId(payload.id);
  if (!storedRefreshToken || storedRefreshToken !== refreshToken) return null;

  const accessToken = tokenService.generateAccessToken(
    payload.id,
    payload.email
  );
  const newRefreshToken = tokenService.generateRefreshToken(
    payload.id,
    payload.email
  );

  await authRepo.saveRefreshToken(payload.id, newRefreshToken);

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};
