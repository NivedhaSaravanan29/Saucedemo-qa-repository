import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,            // tests are independent, so any order is safe
  retries: 0,                     // no retries: a retry would hide flaky tests
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    baseURL: config.baseUrl,
    screenshot: 'only-on-failure', // screenshot saved when a test fails
    trace: 'retain-on-failure',
    testIdAttribute: 'data-test',  // Sauce Demo uses data-test attributes
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
