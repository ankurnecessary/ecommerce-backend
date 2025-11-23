import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/**/*.graphql',
  generates: {
    './src/types/resolver-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        defaultMapper: 'Partial<{T}>'
      }
    }
  }
};

export default config;
