import { defineConfig, devices } from '@playwright/test';
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  testMatch: '**/*Tests.spec.ts',
  // outputDir: path.resolve(__dirname, 'test-results'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,
  reporter: 'list',
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
