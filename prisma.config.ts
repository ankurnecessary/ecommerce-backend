import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

// Construct DATABASE_URL from environment variables if not provided
const constructDatabaseUrl = (): string => {
  if (env('DATABASE_URL') !== undefined && env('DATABASE_URL') !== '') {
    return env('DATABASE_URL');
  }

  const PGHOST =
    env('PGHOST') !== undefined && env('PGHOST') !== '' ? env('PGHOST') : '';
  const PGPORT =
    env('PGPORT') !== undefined && env('PGPORT') !== '' ? env('PGPORT') : '';
  const PGUSER =
    env('PGUSER') !== undefined && env('PGUSER') !== '' ? env('PGUSER') : '';
  const PGPASSWORD =
    env('PGPASSWORD') !== undefined && env('PGPASSWORD') !== ''
      ? env('PGPASSWORD')
      : '';
  const PGDATABASE =
    env('PGDATABASE') !== undefined && env('PGDATABASE') !== ''
      ? env('PGDATABASE')
      : '';
  const PGCONNVARS =
    env('NODE_ENV') !== 'development'
      ? 'sslmode=verify-full&sslrootcert=prisma/ca.pem'
      : 'schema=public';

  if (PGUSER === '' || PGPASSWORD === '' || PGDATABASE === '') {
    throw new Error(
      'Database configuration missing. Please provide either DATABASE_URL or all of: PGUSER, PGPASSWORD, PGDATABASE'
    );
  }

  return `postgresql://${encodeURIComponent(PGUSER)}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}:${PGPORT}/${PGDATABASE}?${PGCONNVARS}`;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: constructDatabaseUrl()
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx ./scripts/db/seed.ts'
  }
});
