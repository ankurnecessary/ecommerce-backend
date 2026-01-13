import { describe, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';
import { GLOBAL_RATE_LIMITS, ONE_MINUTE } from './config/constants.js';

describe('/api rate-limiter', () => {
  it(`blocks after ${GLOBAL_RATE_LIMITS.CONNECTIONS_PER_IP} requests in ${GLOBAL_RATE_LIMITS.TIME_WINDOW / ONE_MINUTE} minute(s)`, async () => {
    const app = createApp();
    for (let i = 0; i < GLOBAL_RATE_LIMITS.CONNECTIONS_PER_IP; i++) {
      await request(app).get('/api').expect(200);
    }
    await request(app).get('/api').expect(429);
  });

  it(`resets after ${GLOBAL_RATE_LIMITS.TIME_WINDOW / ONE_MINUTE} minute(s)`, async () => {
    vi.useFakeTimers();
    const app = createApp();
    for (let i = 0; i < GLOBAL_RATE_LIMITS.CONNECTIONS_PER_IP; i++) {
      await request(app).get('/api').expect(200);
    }
    await request(app).get('/api').expect(429);

    vi.advanceTimersByTime(GLOBAL_RATE_LIMITS.TIME_WINDOW);
    await request(app).get('/api').expect(200);

    vi.useRealTimers();
  });

  it('separates limits by IP', async () => {
    const app = createApp();
    app.set('trust proxy', 'loopback'); // Important to allow X-Forwarded-For for various IPs
    for (let i = 0; i < GLOBAL_RATE_LIMITS.CONNECTIONS_PER_IP - 1; i++) {
      await request(app)
        .get('/api')
        .set('X-Forwarded-For', '1.1.1.1')
        .expect(200);
    }
    await request(app)
      .get('/api')
      .set('X-Forwarded-For', '2.2.2.2')
      .expect(200);

    // Both IPs should still be under limit
    await request(app)
      .get('/api')
      .set('X-Forwarded-For', '1.1.1.1')
      .expect(200);
  });
});
