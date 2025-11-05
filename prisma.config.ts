import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'ts-node ./scripts/db/seed.ts'
  }
});
