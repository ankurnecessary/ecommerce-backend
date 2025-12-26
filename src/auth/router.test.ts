import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { VALIDATION_MESSAGES } from '../config/constants.js';

describe('/api/auth/login', () => {
  it(`should validate { username: 'hello@test.com', password: 'Sec1@ret' }`, async () => {
    const app = createApp();
    const data = { username: 'hello@test.com', password: 'Sec1@ret' };
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

  it(`should invalidate { username: 'hellotest.com', password: 'Sec1@ret' }`, async () => {
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

  it(`should invalidate { username: 'hello@test.com', password: 'Sec1ret' }`, async () => {
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

  it(`should invalidate { username: 'hello@test.com', password: 'Secret' }`, async () => {
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
});
