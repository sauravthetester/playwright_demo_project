import { expect, Locator, Page } from '@playwright/test';

export class ButtonsPage {
  readonly doubleClickBtn: Locator;
  readonly rightClickBtn: Locator;
  readonly clickMeBtn: Locator;
  readonly doubleClickMessage: Locator;
  readonly rightClickMessage: Locator;
  readonly clickMessage: Locator;

  constructor(private readonly page: Page) {
    this.doubleClickBtn = page.locator('#doubleClickBtn');
    this.rightClickBtn = page.locator('#rightClickBtn');
    this.clickMeBtn = page.getByRole('button', { name: 'Click Me' , exact: true });
    this.doubleClickMessage = page.locator('#doubleClickMessage');
    this.rightClickMessage = page.locator('#rightClickMessage');
    this.clickMessage = page.locator('#dynamicClickMessage');
  }

  async doubleClick(): Promise<void> {
    await this.doubleClickBtn.dblclick();
  }



  async rightClick(): Promise<void> {
    await this.rightClickBtn.click({ button: 'right' });
  }

  async regularClick(): Promise<void> {
    await this.clickMeBtn.click();
  }

  async verifyDoubleClickMessage(): Promise<void> {
    await expect(this.doubleClickMessage).toHaveText('You have done a double click');
  }

  async verifyRightClickMessage(): Promise<void> {
    await expect(this.rightClickMessage).toHaveText('You have done a right click');
  }

  async verifyClickMessage(): Promise<void> {
    await expect(this.clickMessage).toHaveText('You have done a dynamic click');
  }
}


