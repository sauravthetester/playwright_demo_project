import { defineConfig } from '@playwright/test';
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  testMatch: '**/*Tests.spec.ts',
  // outputDir: path.resolve(__dirname, 'test-results'),
  globalSetup: path.resolve(__dirname, 'utils/global-setup'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,
  reporter: [['line'], ['allure-playwright']],
  timeout: 100 * 1000,
  use: {
    trace: 'retain-on-failure',
    headless: false,
    baseURL: 'https://demoqa.com/',
    storageState: 'utils/state.json',
    acceptDownloads: true,
  },

  projects: [
    {
      name: 'element-tests-chrome',
      use: { 
        viewport: { width: 1080, height: 700 },
        headless: true,
        storageState: 'utils/state.json',
     },
     testMatch: [
        'tests/elementsTests/*.spec.ts'
      ],
    },
    {
      name: 'forms-tests-chrome',
      use: {
        viewport: { width: 1080, height: 700 },
        headless: false
     },
     testMatch: [
        'tests/formsTests/*.spec.ts'
      ],
    }
  ],
});
