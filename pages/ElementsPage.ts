import { expect, Locator, Page } from '@playwright/test';

export class ElementsPage {

  readonly elementPage: Page;
  readonly textBoxSubMenu: Locator;
  readonly buttonsSubMenu: Locator;
  readonly webTablesSubMenu: Locator;

  constructor(private readonly page: Page) {
    this.elementPage = page;
    this.textBoxSubMenu = page.getByRole('listitem').filter({ hasText: 'Text Box'});
    this.buttonsSubMenu = page.getByRole('listitem').filter({ hasText: 'Buttons' });
    this.webTablesSubMenu = page.getByRole('listitem').filter({ hasText: 'Web Tables' });
  }

  async clickTextBoxSubMenu() {
    await this.textBoxSubMenu.click();
  }
  async clickButtonsSubMenu() {
    await this.buttonsSubMenu.click();
  }

  async clickWebTablesSubMenu() {
    await this.webTablesSubMenu.click();
  }
}
