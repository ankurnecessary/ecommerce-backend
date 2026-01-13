import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.unit.test.ts'],
    setupFiles: ['./src/shared/database/__mocks__/prisma.ts']
  }
});
