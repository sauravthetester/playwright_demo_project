import { expect, Locator, Page } from '@playwright/test';
import { LocatorFallback } from '../utils/LocatorFallback';

export class ElementsPage {
  readonly elementPage: Page;
  readonly textBoxSubMenu: Promise<Locator>;
  readonly buttonsSubMenu: Promise<Locator>;
  readonly webTablesSubMenu: Promise<Locator>;
  private locatorFallback: LocatorFallback;

  constructor(private readonly page: Page) {
    this.elementPage = page;
    this.locatorFallback = new LocatorFallback(page);

    // Text Box Sub Menu with fallback strategies
    this.textBoxSubMenu = this.locatorFallback.getLocatorWithOr([
      () => page.getByRole('listitem').filter({ hasText: 'Text Box' }),
      () => page.locator('li:has-text("Text Box")'),
      () => page.getByText('Text Box', { exact: true }),
      () => page.locator('.menu-list').getByText('Text Box'),
      () => page.locator('span:has-text("Text Box")')
    ]);

    // Buttons Sub Menu with fallback strategies
    this.buttonsSubMenu = this.locatorFallback.getLocatorWithOr([
      () => page.getByRole('listitem').filter({ hasText: 'Buttons' }),
      () => page.locator('li:has-text("Buttons")').first(),
      () => page.getByText('Buttons').first(),
      () => page.locator('.menu-list').getByText('Buttons'),
      () => page.locator('span:has-text("Buttons")').first()
    ]);

    // Web Tables Sub Menu with fallback strategies
    this.webTablesSubMenu = this.locatorFallback.getLocatorWithOr([
      () => page.getByRole('listitem').filter({ hasText: 'Web Tables' }),
      () => page.locator('li:has-text("Web Tables")'),
      () => page.getByText('Web Tables', { exact: true }),
      () => page.locator('.menu-list').getByText('Web Tables'),
      () => page.locator('span:has-text("Web Tables")')
    ]);
  }

  async clickTextBoxSubMenu() {
    await (await this.textBoxSubMenu).click();
  }

  async clickButtonsSubMenu() {
    await (await this.buttonsSubMenu).click();
  }

  async clickWebTablesSubMenu() {
    await (await this.webTablesSubMenu).click();
  }
}
