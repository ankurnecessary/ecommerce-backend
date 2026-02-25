import { ERROR_CODES, ERROR_MESSAGES } from '@/shared/config/constants.js';
import UserRepository from '@/modules/user/domain/UserRepository.js';
import { AuthRepository } from '@/modules/auth/domain/AuthRepository.js';
import { PasswordHasher } from '@/modules/auth/application/ports/PasswordHasher.js';
import { TokenService } from '@/modules/auth/application/ports/TokenService.js';
import { HttpError } from '@/shared/errors/HttpError.js';

type LogoutTokenService = Pick<
  TokenService,
  'generateAccessToken' | 'generateRefreshToken'
>;
export const login = async (
  email: string,
  password: string,
  userRepo: Pick<UserRepository, 'findByEmail'>,
  authRepo: Pick<AuthRepository, 'saveRefreshToken'>,
  hasher: Pick<PasswordHasher, 'compare'>,
  tokenService: LogoutTokenService
) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new HttpError(
      401,
      ERROR_MESSAGES.INVALID_CREDENTIALS,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  const isPasswordValid = await hasher.compare(password, user.password);
  if (!isPasswordValid)
    throw new HttpError(
      401,
      ERROR_MESSAGES.INVALID_CREDENTIALS,
      ERROR_CODES.INVALID_CREDENTIALS
    );

  const userId = user.id;
  const accessToken = tokenService.generateAccessToken(user.id, user.email);
  const refreshToken = tokenService.generateRefreshToken(user.id, user.email);
  await authRepo.saveRefreshToken(userId, refreshToken);

  return {
    id: userId,
    username: email,
    accessToken,
    refreshToken
  };
};
