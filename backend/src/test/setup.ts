import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-64-characters-long-for-testing-purposes';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-64-characters-long-for-testing-purposes';

// Increase timeout for slower tests
jest.setTimeout(30000);

// Mock console.log in tests to reduce noise
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
