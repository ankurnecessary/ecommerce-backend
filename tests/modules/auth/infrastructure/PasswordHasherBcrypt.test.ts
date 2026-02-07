import { describe, expect, it, vi } from 'vitest';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn()
  }
}));

import bcrypt from 'bcrypt';
import { PasswordHasherBcrypt } from '@/modules/auth/infrastructure/PasswordHasherBcrypt.js';

describe('PasswordHasherBcrypt', () => {
  it('delegates to bcrypt.compare', async () => {
    const compareMock = bcrypt.compare as unknown as ReturnType<typeof vi.fn>;
    compareMock.mockResolvedValue(true);

    const result = await PasswordHasherBcrypt.compare('plain', 'hashed');

    expect(compareMock).toHaveBeenCalledWith('plain', 'hashed');
    expect(result).toBe(true);
  });
});
