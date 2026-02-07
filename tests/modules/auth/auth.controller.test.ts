import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('@/modules/auth/application/login.js', () => ({
  login: vi.fn()
}));

vi.mock('@/modules/auth/application/logout.js', () => ({
  logout: vi.fn()
}));

vi.mock('@/modules/auth/config/auth.config.js', () => ({
  authConfig: {
    nodeEnv: 'test',
    accessToken: {
      secret: 'access-secret',
      expiresIn: '900'
    },
    refreshToken: {
      secret: 'refresh-secret',
      expiresIn: '604800'
    }
  }
}));

vi.mock('@/modules/user/infrastructure/UserRepositoryPrisma.js', () => ({
  UserRepositoryPrisma: {}
}));

vi.mock('@/modules/auth/infrastructure/AuthRepositoryPrisma.js', () => ({
  AuthRepositoryPrisma: {}
}));

vi.mock('@/modules/auth/infrastructure/PasswordHasherBcrypt.js', () => ({
  PasswordHasherBcrypt: {}
}));

vi.mock('@/modules/auth/infrastructure/TokenServiceJWT.js', () => ({
  TokenServiceJWT: {}
}));

import type { Request, Response } from 'express';

let login: typeof import('@/modules/auth/application/login.js').login;
let logout: typeof import('@/modules/auth/application/logout.js').logout;
let loginController: typeof import('@/modules/auth/auth.controller.js').loginController;
let logoutController: typeof import('@/modules/auth/auth.controller.js').logoutController;

const createRes = () => {
  const res = {
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return res as unknown as Response;
};

describe('auth.controller', () => {
  beforeAll(async () => {
    const loginModule = await import('@/modules/auth/application/login.js');
    const logoutModule = await import('@/modules/auth/application/logout.js');
    const controllerModule = await import('@/modules/auth/auth.controller.js');

    login = loginModule.login;
    logout = logoutModule.logout;
    loginController = controllerModule.loginController;
    logoutController = controllerModule.logoutController;
  });

  it('sets cookies and returns user on login', async () => {
    const req = {
      body: { username: 'user@example.com', password: 'password' }
    } as Request;
    const res = createRes();
    const loginMock = login as unknown as ReturnType<typeof vi.fn>;
    loginMock.mockResolvedValue({
      id: 'user-1',
      username: 'user@example.com',
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });

    await loginController(req, res);

    expect(login).toHaveBeenCalled();
    expect(loginMock.mock.calls[0]?.[0]).toBe('user@example.com');
    expect(loginMock.mock.calls[0]?.[1]).toBe('password');
    expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 900 * 1000
    });
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 604800 * 1000
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'user-1',
      username: 'user@example.com'
    });
  });

  it('clears cookies and returns message on logout', async () => {
    const req = {
      cookies: { refreshToken: 'refresh-token' }
    } as unknown as Request;
    const res = createRes();
    const logoutMock = logout as unknown as ReturnType<typeof vi.fn>;
    logoutMock.mockResolvedValue(undefined);

    await logoutController(req, res);

    expect(logout).toHaveBeenCalledWith(
      'refresh-token',
      expect.any(Object),
      expect.any(Object)
    );
    expect(res.clearCookie).toHaveBeenCalledWith('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logged out successfully'
    });
  });
});
