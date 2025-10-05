import { Locator, Page } from '@playwright/test';
import { LocatorFallback } from '../pages/utils/LocatorFallback';

export class HomePage {
  readonly elementsCard: Locator;
  readonly formsCard: Locator;
  readonly alertsFrameWindowsCard: Locator;
  readonly widgetsCard: Locator;
  readonly interactionsCard: Locator;
  readonly bookStoreAppCard: Locator;
  private locatorFallback: LocatorFallback;

  constructor(private readonly page: Page) {
    this.locatorFallback = new LocatorFallback(page);

    // Elements Card with fallback strategies
    this.elementsCard = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.card:has-text("Elements")'),
      () => page.locator('.card').filter({ hasText: 'Elements' }),
      () => page.getByText('Elements').locator('..'),
      () => page.locator('[class*="card"]').filter({ hasText: 'Elements' })
    ]);

    // Forms Card with fallback strategies
    this.formsCard = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.card:has-text("Forms")'),
      () => page.locator('.card').filter({ hasText: 'Forms' }),
      () => page.getByText('Forms').locator('..'),
      () => page.locator('[class*="card"]').filter({ hasText: 'Forms' })
    ]);

    // Alerts Frame Windows Card with fallback strategies
    this.alertsFrameWindowsCard = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.card:has-text("Alerts, Frame & Windows")'),
      () => page.locator('.card').filter({ hasText: 'Alerts' }),
      () => page.getByText('Alerts, Frame & Windows').locator('..'),
      () => page.locator('[class*="card"]').filter({ hasText: 'Alerts' })
    ]);

    // Widgets Card with fallback strategies
    this.widgetsCard = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.card:has-text("Widgets")'),
      () => page.locator('.card').filter({ hasText: 'Widgets' }),
      () => page.getByText('Widgets').locator('..'),
      () => page.locator('[class*="card"]').filter({ hasText: 'Widgets' })
    ]);

    // Interactions Card with fallback strategies
    this.interactionsCard = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.card:has-text("Interactions")'),
      () => page.locator('.card').filter({ hasText: 'Interactions' }),
      () => page.getByText('Interactions').locator('..'),
      () => page.locator('[class*="card"]').filter({ hasText: 'Interactions' })
    ]);

    // Book Store App Card with fallback strategies
    this.bookStoreAppCard = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.card:has-text("Book Store Application")'),
      () => page.locator('.card').filter({ hasText: 'Book Store' }),
      () => page.getByText('Book Store Application').locator('..'),
      () => page.locator('[class*="card"]').filter({ hasText: 'Book Store' })
    ]);
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
