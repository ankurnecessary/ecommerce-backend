import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';

const envDefaults = {
  AUTH_ACCESS_TOKEN_SECRET: 'access-secret',
  AUTH_REFRESH_TOKEN_SECRET: 'refresh-secret',
  AUTH_ACCESS_TOKEN_TTL: '900',
  AUTH_REFRESH_TOKEN_TTL: '604800',
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://user:pass@localhost:5432/db'
};

const loadTokenService = async () => {
  vi.resetModules();
  Object.assign(process.env, envDefaults);
  const module = await import(
    '../../../../src/modules/auth/infrastructure/TokenServiceJWT.js'
  );
  return module.TokenServiceJWT;
};

describe('TokenServiceJWT', () => {
  beforeEach(() => {
    Object.assign(process.env, envDefaults);
  });
  it('generates access token', async () => {
    const tokenService = await loadTokenService();
    const id = '11111111-1111-4111-8111-111111111111';
    const email = 'user@example.com';

    const accessToken = tokenService.generateAccessToken(id, email);

    expect(accessToken).not.toBeFalsy();
  });

  it('generates and verifies a refresh token', async () => {
    const tokenService = await loadTokenService();
    const id = '11111111-1111-4111-8111-111111111111';
    const email = 'user@example.com';

    const refreshToken = tokenService.generateRefreshToken(id, email);

    const payload = tokenService.verifyRefreshToken(refreshToken);

    expect(payload).toMatchObject({ id, email });
  });

  it('returns null for invalid refresh tokens', async () => {
    const tokenService = await loadTokenService();

    const payload = tokenService.verifyRefreshToken('not-a-token');

    expect(payload).toBeNull();
  });

  it('returns null when refresh token payload fails schema validation', async () => {
    const tokenService = await loadTokenService();

    const refreshToken = jwt.sign(
      { id: 'not-a-uuid', email: 'userexample.com' },
      envDefaults.AUTH_REFRESH_TOKEN_SECRET
    );

    const payload = tokenService.verifyRefreshToken(refreshToken);

    expect(payload).toBeNull();
  });
});
