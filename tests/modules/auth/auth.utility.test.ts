import type { Request } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { getRefreshToken } from '@/modules/auth/auth.utility.js';

const createReq = (options?: {
  cookieToken?: string;
  headerToken?: string;
  lowerHeaderToken?: string;
}) =>
  ({
    cookies: options?.cookieToken
      ? { refreshToken: options.cookieToken }
      : undefined,
    header: vi.fn((name: string) => {
      if (name === 'X-Refresh-Token') return options?.headerToken;
      if (name === 'x-refresh-token') return options?.lowerHeaderToken;
      return undefined;
    })
  }) as unknown as Request;

describe('getRefreshToken', () => {
  it('returns refresh token from cookie when present', () => {
    const req = createReq({
      cookieToken: 'cookie-token',
      headerToken: 'header-token'
    });

    const token = getRefreshToken(req);

    expect(token).toBe('cookie-token');
  });

  it('returns token from X-Refresh-Token header when cookie is absent', () => {
    const req = createReq({ headerToken: 'header-token' });

    const token = getRefreshToken(req);

    expect(token).toBe('header-token');
  });

  it('returns token from x-refresh-token header when X-Refresh-Token is absent', () => {
    const req = createReq({ lowerHeaderToken: 'lower-header-token' });

    const token = getRefreshToken(req);

    expect(token).toBe('lower-header-token');
  });

  it('trims header token before returning', () => {
    const req = createReq({ headerToken: '  header-token  ' });

    const token = getRefreshToken(req);

    expect(token).toBe('header-token');
  });

  it('returns undefined when no cookie and no header token are provided', () => {
    const req = createReq();

    const token = getRefreshToken(req);

    expect(token).toBeUndefined();
  });
});
