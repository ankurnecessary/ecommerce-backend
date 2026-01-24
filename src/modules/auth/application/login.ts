import { VALIDATION_MESSAGES } from '../../../shared/config/constants.js';
import UserRepository from '../../user/domain/UserRepository.js';
import { AuthRepository } from '../domain/AuthRepository.js';
import { PasswordHasher } from './ports/PasswordHasher.js';
import { TokenService } from './ports/TokenService.js';

export const login = async (
  email: string,
  password: string,
  userRepo: UserRepository,
  authRepo: AuthRepository,
  hasher: PasswordHasher,
  tokenService: TokenService
) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);

  const isPasswordValid = await hasher.compare(password, user.password);
  if (!isPasswordValid)
    throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);

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
