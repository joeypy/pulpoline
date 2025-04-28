// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Si actualmente tienes "rootDir": "src", bórralo de package.json
  // para que Jest busque en toda la carpeta raíz.

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Opcional: ignora los .js de extensiones VSCode y wallaby
  transformIgnorePatterns: ['/node_modules/(?!some-esm-module)'],
};
