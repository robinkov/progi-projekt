import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'e2e/test-results/artifacts',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  reporter: [['html', { outputFolder: 'e2e/test-results/html-report', open: 'never' }]],
});
