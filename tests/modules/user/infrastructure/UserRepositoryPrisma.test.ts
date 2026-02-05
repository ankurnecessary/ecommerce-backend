import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../../src/lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn()
    }
  }
}));

import { prisma } from '../../../../src/lib/prisma.js';
import { User } from '../../../../src/modules/user/domain/User.js';
import { UserRepositoryPrisma } from '../../../../src/modules/user/infrastructure/UserRepositoryPrisma.js';

describe('UserRepositoryPrisma', () => {
  const findUniqueMock = vi.mocked(prisma.user.findUnique);

  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it('returns null when user is not found', async () => {
    findUniqueMock.mockResolvedValue(null);

    const result = await UserRepositoryPrisma.findByEmail(
      'missing@example.com'
    );

    expect(result).toBeNull();
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { email: 'missing@example.com' }
    });
  });

  it('returns a User when record exists', async () => {
    findUniqueMock.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed',
      role: 'user',
      refreshToken: null,
      createdBy: null,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: new Date()
    });

    const result = await UserRepositoryPrisma.findByEmail('user@example.com');

    expect(result).toBeInstanceOf(User);
    expect(result?.id).toBe('user-1');
    expect(result?.email).toBe('user@example.com');
    expect(result?.password).toBe('hashed');
    expect(result?.role).toBe('user');
  });
});
