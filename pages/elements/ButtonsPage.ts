import { expect, Locator, Page } from '@playwright/test';
import { LocatorFallback } from '../utils/LocatorFallback';

export class ButtonsPage {
  readonly doubleClickBtn: Promise<Locator>;
  readonly rightClickBtn: Promise<Locator>;
  readonly clickMeBtn: Promise<Locator>;
  readonly doubleClickMessage: Promise<Locator>;
  readonly rightClickMessage: Promise<Locator>;
  readonly clickMessage: Promise<Locator>;
  private locatorFallback: LocatorFallback;

  constructor(private readonly page: Page) {
    this.locatorFallback = new LocatorFallback(page);
    
    // Double Click Button with fallback strategies
    this.doubleClickBtn = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#doubleClickBtn'),
      () => page.getByRole('button', { name: 'Double Click Me' }),
      () => page.locator('button:has-text("Double Click Me")'),
      () => page.locator('[onclick*="doubleClick"]')
    ]);

    // Right Click Button with fallback strategies
    this.rightClickBtn = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#rightClickBtn'),
      () => page.getByRole('button', { name: 'Right Click Me' }),
      () => page.locator('button:has-text("Right Click Me")'),
      () => page.locator('[onclick*="rightClick"]')
    ]);

    // Regular Click Button with fallback strategies
    this.clickMeBtn = this.locatorFallback.getLocatorWithOr([
      () => page.getByRole('button', { name: 'Click Me', exact: true }),
      () => page.locator('button:has-text("Click Me")').nth(2),
      () => page.locator('[onclick*="dynamicClick"]'),
      () => page.locator('button').filter({ hasText: /^Click Me$/ }).nth(2)
    ]);

    // Double Click Message with fallback strategies
    this.doubleClickMessage = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#doubleClickMessage'),
      () => page.locator('p:has-text("double click")'),
      () => page.getByText('You have done a double click')
    ]);

    // Right Click Message with fallback strategies
    this.rightClickMessage = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#rightClickMessage'),
      () => page.locator('p:has-text("right click")'),
      () => page.getByText('You have done a right click')
    ]);

    // Dynamic Click Message with fallback strategies
    this.clickMessage = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#dynamicClickMessage'),
      () => page.locator('p:has-text("dynamic click")'),
      () => page.getByText('You have done a dynamic click')
    ]);
  }

  async doubleClick(): Promise<void> {
    await (await this.doubleClickBtn).dblclick();
  }

  async rightClick(): Promise<void> {
    await (await this.rightClickBtn).click({ button: 'right' });
  }

  async regularClick(): Promise<void> {
    await (await this.clickMeBtn).click();
  }

  async verifyDoubleClickMessage(): Promise<void> {
    await expect(await this.doubleClickMessage).toHaveText('You have done a double click');
  }

  async verifyRightClickMessage(): Promise<void> {
    await expect(await this.rightClickMessage).toHaveText('You have done a right click');
  }

  async verifyClickMessage(): Promise<void> {
    await expect(await this.clickMessage).toHaveText('You have done a dynamic click');
  }
}
