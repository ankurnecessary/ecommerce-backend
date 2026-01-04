import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import {
  LOGIN_RATE_LIMITS,
  ONE_MINUTE,
  VALIDATION_MESSAGES
} from '../config/constants.js';
import { authLimiter } from './router.js';
import { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/env.js';
// [x]: Set a separate setup for test database
describe(`/api/auth/login rate-limiter`, () => {
  beforeEach(() => {
    authLimiter.resetKey(ipKeyGenerator('::ffff:127.0.0.1', 56));
  });
  it(`blocks after ${LOGIN_RATE_LIMITS.CONNECTIONS_PER_IP} requests in ${LOGIN_RATE_LIMITS.TIME_WINDOW / ONE_MINUTE} minute(s)`, async () => {
    const app = createApp();
    const data = {
      username: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD
    };
    for (let i = 0; i < LOGIN_RATE_LIMITS.CONNECTIONS_PER_IP; i++) {
      await request(app).post('/api/auth/login').send(data).expect(200);
    }
    await request(app).post('/api/auth/login').send(data).expect(429);
  });

  it(`resets after ${LOGIN_RATE_LIMITS.TIME_WINDOW / ONE_MINUTE} minute(s)`, async () => {
    vi.useFakeTimers();
    const app = createApp();
    const data = {
      username: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD
    };
    for (let i = 0; i < LOGIN_RATE_LIMITS.CONNECTIONS_PER_IP; i++) {
      await request(app).post('/api/auth/login').send(data).expect(200);
    }
    await request(app).post('/api/auth/login').send(data).expect(429);

    vi.advanceTimersByTime(LOGIN_RATE_LIMITS.TIME_WINDOW);
    await request(app).post('/api/auth/login').send(data).expect(200);

    vi.useRealTimers();
  });

  it('separates limits by IP', async () => {
    const app = createApp();
    const data = {
      username: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD
    };
    app.set('trust proxy', 'loopback'); // Important to allow X-Forwarded-For for various IPs
    for (let i = 0; i < LOGIN_RATE_LIMITS.CONNECTIONS_PER_IP - 1; i++) {
      await request(app)
        .post('/api/auth/login')
        .send(data)
        .set('X-Forwarded-For', '1.1.1.1')
        .expect(200);
    }
    await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('X-Forwarded-For', '2.2.2.2')
      .expect(200);

    // Both IPs should still be under limit
    await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('X-Forwarded-For', '1.1.1.1')
      .expect(200);
  });
});

describe('/api/auth/login', () => {
  beforeEach(() => {
    authLimiter.resetKey(ipKeyGenerator('::ffff:127.0.0.1', 56));
  });
  it(`should validate { username: 'hello@test.com', password: 'Sec1@ret' }`, async () => {
    const app = createApp();
    const data = {
      username: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD
    };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.message).toEqual(VALIDATION_MESSAGES.LOGIN_SUCCESSFUL);
  });

  it(`should invalidate { username: '', password: '' }`, async () => {
    const app = createApp();
    const data = { username: '', password: '' };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.errors[0]).toEqual(
      VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
    );
  });

  it(`should invalidate { username: 'hellotest.com', password: 'Sec1@ret' } because username is invalid`, async () => {
    const app = createApp();
    const data = { username: 'hellotest.com', password: 'Sec1@ret' };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.errors[0]).toEqual(
      VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
    );
  });

  it(`should invalidate { username: 'hello@test.com', password: 'Sec1ret' } because of password validation error`, async () => {
    const app = createApp();
    const data = { username: 'hello@test.com', password: 'Sec1ret' };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.errors[0]).toEqual(
      VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
    );
  });

  it(`should invalidate { username: 'hello@test.com', password: 'Secret' } because of password validation error`, async () => {
    const app = createApp();
    const data = { username: 'hello@test.com', password: 'Secret' };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.errors[0]).toEqual(
      VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
    );
  });

  it(`should invalidate {"username": "something@test.com", "password": "Sec1@ret"} because username doesn't exist in database`, async () => {
    const app = createApp();
    const data = { username: 'something@test.com', password: 'Sec1@ret' };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.errors[0]).toEqual(
      VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
    );
  });

  it('should invalidate {"username": "hello@test.com", "password": "Sec@ret"} because password is wrong', async () => {
    const app = createApp();
    const data = {
      username: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD + '1'
    };
    const response = await request(app)
      .post('/api/auth/login')
      .send(data)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.errors[0]).toEqual(
      VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
    );
  });
});
