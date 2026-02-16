import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../../src/lib/prisma.js', () => ({
  prisma: {
    user: {
      update: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn()
    }
  }
}));

import { prisma } from '@/lib/prisma.js';
import { User } from '@/modules/user/domain/User.js';
import { AuthRepositoryPrisma } from '@/modules/auth/infrastructure/AuthRepositoryPrisma.js';

describe('AuthRepositoryPrisma', () => {
  const updateMock = prisma.user.update as unknown as ReturnType<typeof vi.fn>;
  const updateManyMock = prisma.user.updateMany as unknown as ReturnType<
    typeof vi.fn
  >;
  const findUniqueMock = prisma.user.findUnique as unknown as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    updateMock.mockReset();
    updateManyMock.mockReset();
    findUniqueMock.mockReset();
  });

  it('returns null when update returns no record', async () => {
    updateMock.mockResolvedValue(null);

    const result = await AuthRepositoryPrisma.saveRefreshToken(
      'user-1',
      'token'
    );

    expect(result).toBeNull();
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { refreshToken: 'token' }
    });
  });

  it('returns a User when update succeeds', async () => {
    updateMock.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed',
      role: 'customer',
      refreshToken: null,
      createdBy: null,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: new Date()
    });

    const result = await AuthRepositoryPrisma.saveRefreshToken(
      'user-1',
      'token'
    );

    expect(result).toBeInstanceOf(User);
    expect(result?.id).toBe('user-1');
    expect(result?.email).toBe('user@example.com');
  });

  it('clears refresh token for the user', async () => {
    updateManyMock.mockResolvedValue({ count: 1 });

    await AuthRepositoryPrisma.clearRefreshTokenIfExists('user-1');

    expect(updateManyMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { refreshToken: '' }
    });
  });

  it('returns null when no refresh token is stored for user', async () => {
    findUniqueMock.mockResolvedValue({ refreshToken: '' });

    const result = await AuthRepositoryPrisma.getRefreshTokenByUserId('user-1');

    expect(result).toBeNull();
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { refreshToken: true }
    });
  });

  it('returns refresh token when present for user', async () => {
    findUniqueMock.mockResolvedValue({ refreshToken: 'refresh-token' });

    const result = await AuthRepositoryPrisma.getRefreshTokenByUserId('user-1');

    expect(result).toBe('refresh-token');
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { refreshToken: true }
    });
  });
});
