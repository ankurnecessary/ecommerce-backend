import type { Mock } from 'vitest';
import { describe, it, expect } from 'vitest';
import { getUser, saveRefreshToken } from './services.js';
import { prismaMock } from '../shared/database/__mocks__/prisma.js';
import type { User } from '../generated/prisma/client.js';

describe('getUser', () => {
  it('returns a user when found', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed',
      refreshToken: null,
      createdBy: '1',
      createdAt: new Date(),
      updatedBy: '1',
      updatedAt: new Date()
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    const result = await getUser('test@example.com');

    expect(result).toEqual(mockUser);
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
  });

  it('returns null when user is not found', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const result = await getUser('unknown@example.com');

    expect(result).toBeNull();
  });

  it('calls prisma.user.findFirst exactly once', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    await getUser('test@example.com');

    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
  });

  it('passes the correct query shape to Prisma', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    await getUser('hello@test.com');

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'hello@test.com' }
    });
  });

  it('handles empty string input', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const result = await getUser('');

    expect(result).toBeNull();
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: '' }
    });
  });

  it('propagates Prisma errors', async () => {
    prismaMock.user.findFirst.mockRejectedValue(new Error('DB error'));

    await expect(getUser('test@example.com')).rejects.toThrow('DB error');
  });

  it('does not mutate the returned user object', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed',
      refreshToken: null,
      createdBy: '1',
      createdAt: new Date(),
      updatedBy: '1',
      updatedAt: new Date()
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    const result = await getUser('test@example.com');

    expect(result).toBe(mockUser); // same reference
  });

  it('awaits the Prisma promise correctly', async () => {
    prismaMock.user.findFirst.mockImplementation(
      () => delayResolve(null, 10) as any
    );
    const result = await getUser('slow@test.com');

    expect(result).toBeNull();
  });
});

async function delayResolve<T>(value: T, ms: number): Promise<T> {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve(value);
    }, ms)
  );
}

describe('saveRefreshToken', () => {
  it('updates the refresh token successfully (happy path)', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed',
      refreshToken: null,
      createdBy: null,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: new Date()
    };

    prismaMock.user.update.mockResolvedValue(mockUser);

    await expect(
      saveRefreshToken('token123', 'user-1')
    ).resolves.toBeUndefined();

    const updateMock = prismaMock.user.update;
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { refreshToken: 'token123' }
    });
  });

  it('calls prisma.user.update exactly once', async () => {
    prismaMock.user.update.mockResolvedValue(undefined as unknown as User);

    await saveRefreshToken('abc', 'user-2');

    const updateMock = prismaMock.user.update as unknown as Mock;
    expect(updateMock).toHaveBeenCalledTimes(1);
  });

  it('propagates Prisma errors', async () => {
    prismaMock.user.update.mockRejectedValue(new Error('DB error'));

    await expect(saveRefreshToken('token', 'user-3')).rejects.toThrow(
      'DB error'
    );
  });

  it('returns void (undefined)', async () => {
    prismaMock.user.update.mockResolvedValue(undefined as unknown as User);
    await expect(saveRefreshToken('xyz', 'user-4')).resolves.toBeUndefined();
  });

  it('handles empty token input', async () => {
    prismaMock.user.update.mockResolvedValue(undefined as unknown as User);

    await saveRefreshToken('', 'user-5');

    const updateMock = prismaMock.user.update as unknown as Mock;
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'user-5' },
      data: { refreshToken: '' }
    });
  });

  it('handles empty userId input', async () => {
    prismaMock.user.update.mockResolvedValue(undefined as unknown as User);

    await saveRefreshToken('token123', '');

    const updateMock = prismaMock.user.update as unknown as Mock;
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: '' },
      data: { refreshToken: 'token123' }
    });
  });

  it('does not call any other Prisma methods', async () => {
    prismaMock.user.update.mockResolvedValue(undefined as unknown as User);

    await saveRefreshToken('token', 'user-6');

    const updateMock = prismaMock.user.update as unknown as Mock;
    expect(updateMock).toHaveBeenCalledTimes(1);

    // Ensure no other model methods were touched
    expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.user.create).not.toHaveBeenCalled();
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it('awaits Prisma correctly (delayed resolution)', async () => {
    prismaMock.user.update.mockImplementation(
      () => delayResolve(null, 10) as any
    );

    await expect(saveRefreshToken('slow', 'user-7')).resolves.toBeUndefined();
  });
});
