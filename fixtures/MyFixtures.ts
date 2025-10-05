import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ElementsPage } from '../pages/ElementsPage';
import { TextboxPage } from '../pages/elements/TextboxPage';
import { ButtonsPage } from '../pages/elements/ButtonsPage';
import { FormsPage } from '../pages/FormsPage';
import { PracticeFormPage } from '../pages/forms/PracticeFormPage';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  homePage: HomePage;
  elementsPage: ElementsPage;
  textBoxPage: TextboxPage;
  buttonsPage: ButtonsPage;
  formsPage: FormsPage;
  practiceFormPage: PracticeFormPage;
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const request = route.request();
      if (request.resourceType() === 'image') {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto('https://demoqa.com/');
    await page.evaluate(() => {
      document.body.style.zoom = '60%';
    });
    await page.waitForLoadState('domcontentloaded');
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
  },

  formsPage: async ({ page }, use) => {
    const formsPage = new FormsPage(page);
    await use(formsPage);
  },

  practiceFormPage: async ({ page }, use) => {
    const practiceFormPage = new PracticeFormPage(page);
    await use(practiceFormPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  }
});

export { expect } from '@playwright/test';
