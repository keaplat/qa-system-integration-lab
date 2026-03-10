import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  globalSetup: './scripts/globalSetup.ts',
  globalTeardown: './scripts/globalTeardown.ts',
  projects: [
    {
      name: 'chromium',
      testMatch: /tests[\\/](api|e2e)[\\/].*\.spec\.ts/
    }
  ]
});
