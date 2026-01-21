module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.scripts.json']
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      env: { node: true },
      parserOptions: { sourceType: 'script' }
    }
  ],
  rules: {
    'prettier/prettier': 'error'
  },
  ignorePatterns: ['dist/**']
};
