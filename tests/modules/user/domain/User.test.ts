import { describe, expect, it } from 'vitest';

import { User } from '@/modules/user/domain/User.js';

describe('User', () => {
  it('creates a user with valid props', () => {
    const user = User.create({
      id: 'user-1',
      email: 'user@example.com',
      password: 'secret',
      role: 'customer'
    });

    expect(user.id).toBe('user-1');
    expect(user.email).toBe('user@example.com');
    expect(user.password).toBe('secret');
    expect(user.role).toBe('customer');
  });

  it('throws when email is invalid', () => {
    expect(() =>
      User.create({
        id: 'user-1',
        email: 'not-an-email',
        password: 'secret',
        role: 'customer'
      })
    ).toThrow('Invalid email address');
  });
});
