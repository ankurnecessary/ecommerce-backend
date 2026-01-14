import { describe, it, expect } from 'vitest';
import { getUser } from './services.js';
import { prismaMock } from '../shared/database/__mocks__/prisma.js';

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
