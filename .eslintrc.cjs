module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './tests/tsconfig.json',
      './tsconfig.scripts.json'
    ]
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
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*', '../**']
      }
    ]
  },
  ignorePatterns: ['dist/**']
};
