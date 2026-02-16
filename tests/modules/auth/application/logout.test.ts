import { describe, expect, it, vi } from 'vitest';

import { logout } from '@/modules/auth/application/logout.js';

describe('logout', () => {
  it('returns early when refresh token is missing', async () => {
    const authRepo = {
      clearRefreshTokenIfExists: vi.fn()
    };
    const tokenService = {
      verifyRefreshToken: vi.fn()
    };

    await logout(undefined, authRepo, tokenService);

    expect(tokenService.verifyRefreshToken).not.toHaveBeenCalled();
    expect(authRepo.clearRefreshTokenIfExists).not.toHaveBeenCalled();
  });

  it('returns early when refresh token is invalid', async () => {
    const authRepo = {
      clearRefreshTokenIfExists: vi.fn()
    };
    const tokenService = {
      verifyRefreshToken: vi.fn().mockReturnValue(null)
    };

    await logout('bad-token', authRepo, tokenService);

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith('bad-token');
    expect(authRepo.clearRefreshTokenIfExists).not.toHaveBeenCalled();
  });

  it('clears refresh token when payload is valid', async () => {
    const authRepo = {
      clearRefreshTokenIfExists: vi.fn()
    };
    const tokenService = {
      verifyRefreshToken: vi.fn().mockReturnValue({
        id: 'user-1',
        email: 'user@example.com'
      })
    };

    await logout('refresh-token', authRepo, tokenService);

    expect(authRepo.clearRefreshTokenIfExists).toHaveBeenCalledWith('user-1');
  });
});
