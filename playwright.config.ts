import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/',
  testMatch: '**/*Tests.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,
  reporter: 'html',
  timeout: 180 * 1000,
  use: {
    trace: 'on-first-retry',
    headless: false,
    baseURL: 'https://demoqa.com/',
    acceptDownloads: true
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
