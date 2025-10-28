import { chromium, type FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}login`);
  await page.getByPlaceholder('UserName').fill(process.env.USERNAME as string);
  await page.getByPlaceholder('Password').fill(process.env.PASSWORD as string);
  await page.locator('#login').click();
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;