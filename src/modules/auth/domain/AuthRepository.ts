import { User } from '@/modules/user/domain/User.js';

export interface AuthRepository {
  saveRefreshToken(userId: string, refreshToken: string): Promise<User | null>;
  clearRefreshTokenIfExists(userId: string): Promise<void>;
  getRefreshTokenByUserId(userId: string): Promise<string | null>;
}
