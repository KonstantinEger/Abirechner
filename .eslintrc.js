module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
    'quotes': ['error', 'single'],
    'brace-style': ['error', '1tbs'],
    'no-extra-parens': 'error',
    'arrow-parens': ['error', 'always']
  }
};