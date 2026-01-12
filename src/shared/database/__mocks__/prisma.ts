import type { PrismaClient } from '../../../generated/prisma/client.js';
import { vi, beforeEach } from 'vitest';
import { mockReset, mockDeep } from 'vitest-mock-extended';
import type { DeepMockProxy } from 'vitest-mock-extended';
import { prisma } from '../prisma.js';

vi.mock('../prisma.js', () => ({
  prisma: mockDeep<PrismaClient>()
}));

// Create typed mock instance
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
});
