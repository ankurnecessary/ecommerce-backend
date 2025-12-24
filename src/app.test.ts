import { describe, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('/api', () => {
  it('blocks after 100 requests in a minute', async () => {
    const app = createApp();
    for (let i = 0; i < 100; i++) {
      await request(app).get('/api').expect(200);
    }
    await request(app).get('/api').expect(429);
  });

  it('resets after windowMs', async () => {
    vi.useFakeTimers();
    const app = createApp();
    for (let i = 0; i < 100; i++) {
      await request(app).get('/api').expect(200);
    }
    await request(app).get('/api').expect(429);

    vi.advanceTimersByTime(60 * 1000);
    await request(app).get('/api').expect(200);

    vi.useRealTimers();
  });

  it('separates limits by IP', async () => {
    const app = createApp();
    app.set('trust proxy', 'loopback'); // Important to allow X-Forwarded-For for various IPs
    for (let i = 0; i < 99; i++) {
      await request(app)
        .get('/api')
        .set('X-Forwarded-For', '1.1.1.2')
        .expect(200);
    }
    await request(app)
      .get('/api')
      .set('X-Forwarded-For', '2.2.2.2')
      .expect(200);

    // Both IPs should still be under limit
    await request(app)
      .get('/api')
      .set('X-Forwarded-For', '1.1.1.2')
      .expect(200);
  });
});
