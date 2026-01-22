import config from './jest-shared.ts';
export default {
  ...config,
  testMatch: ['<rootDir>/src/**/__test__/e2e/**/*.spec.ts'],
};
