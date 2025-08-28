import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly elementsCard: Locator;
  readonly formsCard: Locator;
  readonly alertsFrameWindowsCard: Locator;
  readonly widgetsCard: Locator;
  readonly interactionsCard: Locator;
  readonly bookStoreAppCard: Locator;

  constructor(private readonly page: Page) {
    this.elementsCard = page.locator('.card:has-text("Elements")');
    this.formsCard = page.locator('.card:has-text("Forms")');
    this.alertsFrameWindowsCard = page.locator('.card:has-text("Alerts, Frame & Windows")');
    this.widgetsCard = page.locator('.card:has-text("Widgets")');
    this.interactionsCard = page.locator('.card:has-text("Interactions")');
    this.bookStoreAppCard = page.locator('.card:has-text("Book Store Application")');
  }

  async clickElementsCard(): Promise<void> {
    await this.elementsCard.click();
  }

  async clickFormsCard(): Promise<void> {
    await this.formsCard.click();
  }

  async clickAlertsFrameWindowsCard(): Promise<void> {
    await this.alertsFrameWindowsCard.click();
  }

  async clickWidgetsCard(): Promise<void> {
    await this.widgetsCard.click();
  }

  async clickInteractionsCard(): Promise<void> {
    await this.interactionsCard.click();
  }

  async clickBookStoreAppCard(): Promise<void> {
    await this.bookStoreAppCard.click();
  }
}
