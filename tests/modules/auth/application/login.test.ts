import { describe, expect, it, vi } from 'vitest';

import { login } from '../../../../src/modules/auth/application/login.js';
import { User } from '../../../../src/modules/user/domain/User.js';
import { VALIDATION_MESSAGES } from '../../../../src/shared/config/constants.js';

describe('login', () => {
  it('throws when user is not found', async () => {
    const userRepo = {
      findByEmail: vi.fn().mockResolvedValue(null)
    };
    const authRepo = {
      saveRefreshToken: vi.fn()
    };
    const hasher = {
      compare: vi.fn()
    };
    const tokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn()
    };

    await expect(
      login(
        'missing@example.com',
        'password',
        userRepo,
        authRepo,
        hasher,
        tokenService
      )
    ).rejects.toThrow(VALIDATION_MESSAGES.INVALID_CREDENTIALS);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('missing@example.com');
    expect(hasher.compare).not.toHaveBeenCalled();
    expect(authRepo.saveRefreshToken).not.toHaveBeenCalled();
  });

  it('throws when password is invalid', async () => {
    const user = User.create({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed',
      role: 'customer'
    });
    const userRepo = {
      findByEmail: vi.fn().mockResolvedValue(user)
    };
    const authRepo = {
      saveRefreshToken: vi.fn()
    };
    const hasher = {
      compare: vi.fn().mockResolvedValue(false)
    };
    const tokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn()
    };

    await expect(
      login(
        'user@example.com',
        'bad-password',
        userRepo,
        authRepo,
        hasher,
        tokenService
      )
    ).rejects.toThrow(VALIDATION_MESSAGES.INVALID_CREDENTIALS);

    expect(hasher.compare).toHaveBeenCalledWith('bad-password', 'hashed');
    expect(authRepo.saveRefreshToken).not.toHaveBeenCalled();
  });

  it('returns tokens and saves refresh token when valid', async () => {
    const user = User.create({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed',
      role: 'customer'
    });
    const userRepo = {
      findByEmail: vi.fn().mockResolvedValue(user)
    };
    const authRepo = {
      saveRefreshToken: vi.fn()
    };
    const hasher = {
      compare: vi.fn().mockResolvedValue(true)
    };
    const tokenService = {
      generateAccessToken: vi.fn().mockReturnValue('access-token'),
      generateRefreshToken: vi.fn().mockReturnValue('refresh-token')
    };

    const result = await login(
      'user@example.com',
      'password',
      userRepo,
      authRepo,
      hasher,
      tokenService
    );

    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(
      'user-1',
      'user@example.com'
    );
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith(
      'user-1',
      'user@example.com'
    );
    expect(authRepo.saveRefreshToken).toHaveBeenCalledWith(
      'user-1',
      'refresh-token'
    );
    expect(result).toEqual({
      id: 'user-1',
      username: 'user@example.com',
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });
  });
});
