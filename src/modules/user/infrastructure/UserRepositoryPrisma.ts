import { prisma } from '../../../lib/prisma.js';
import { User } from '../domain/User.js';
import UserRepository from '../domain/UserRepository.js';

export const UserRepositoryPrisma: UserRepository = {
  async findByEmail(email: string) {
    const record = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!record) {
      return null;
    }

    return User.create({
      id: record.id,
      email: record.email,
      password: record.password,
      role: record.role
    });
  }
};
