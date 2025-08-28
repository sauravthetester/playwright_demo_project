import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ElementsPage } from '../pages/ElementsPage';
import { TextboxPage } from '../pages/elements/TextboxPage';
import { ButtonsPage } from '../pages/elements/ButtonsPage';

type MyFixtures = {
  homePage: HomePage;
  elementsPage: ElementsPage;
  textBoxPage: TextboxPage;
  buttonsPage: ButtonsPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await page.goto('https://demoqa.com/');
    const homePage = new HomePage(page);
    await use(homePage);
  },

  elementsPage: async ({ page }, use) => {
    const elementsPage = new ElementsPage(page);
    await use(elementsPage);
  },
  textBoxPage: async ({ page }, use) => {
    const textBoxPage = new TextboxPage(page);
    await use(textBoxPage);
  },
  buttonsPage: async ({ page }, use) => {
    const buttonsPage = new ButtonsPage(page);
    await use(buttonsPage);
  }
});

export { expect } from '@playwright/test';
