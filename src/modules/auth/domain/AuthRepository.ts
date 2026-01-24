import { User } from '../../user/domain/User.js';

export interface AuthRepository {
  saveRefreshToken(userId: string, refreshToken: string): Promise<User | null>;
}
