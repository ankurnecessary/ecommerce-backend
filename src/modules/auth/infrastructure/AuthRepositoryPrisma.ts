import { prisma } from '@/lib/prisma.js';
import { User } from '@/modules/user/domain/User.js';
import { AuthRepository } from '@/modules/auth/domain/AuthRepository.js';

export const AuthRepositoryPrisma: AuthRepository = {
  async saveRefreshToken(userId: string, refreshToken: string) {
    const record = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken
      }
    });

    if (!record) return null;

    return User.create({
      id: record.id,
      email: record.email,
      password: record.password,
      role: record.role
    });
  },
  async clearRefreshTokenIfExists(userId: string) {
    await prisma.user.updateMany({
      where: {
        id: userId
      },
      data: {
        refreshToken: ''
      }
    });
  }
};
