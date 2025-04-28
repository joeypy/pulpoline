module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // ①
  parserOptions: {
    project: './tsconfig.json', // ②
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier'], // ③
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // reglas TS básicas
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // reglas que usan el TypeChecker
    'plugin:prettier/recommended', // integración Prettier
  ],
  settings: {},
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
  },
};
