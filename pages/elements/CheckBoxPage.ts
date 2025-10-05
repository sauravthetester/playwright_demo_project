import { expect, Locator, Page } from '@playwright/test';
import { LocatorFallback } from '../utils/LocatorFallback';

export class CheckBoxPage {
  readonly expandAllButton: Locator;
  readonly collapseAllButton: Locator;
  readonly resultSection: Locator;
  private locatorFallback: LocatorFallback;

  constructor(private readonly page: Page) {
    this.locatorFallback = new LocatorFallback(page);

    // Expand All Button with fallback strategies
    this.expandAllButton = this.locatorFallback.getLocatorWithOr([
      () => page.locator('button[title="Expand all"]'),
      () => page.locator('.rct-option-expand-all'),
      () => page.locator('button:has-text("Expand")'),
      () => page.locator('[class*="expand-all"]')
    ]);

    // Collapse All Button with fallback strategies
    this.collapseAllButton = this.locatorFallback.getLocatorWithOr([
      () => page.locator('button[title="Collapse all"]'),
      () => page.locator('.rct-option-collapse-all'),
      () => page.locator('button:has-text("Collapse")'),
      () => page.locator('[class*="collapse-all"]')
    ]);

    // Result Section with fallback strategies
    this.resultSection = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#result'),
      () => page.locator('.display-result'),
      () => page.locator('[id="result"]'),
      () => page.locator('div:has-text("You have selected")').first()
    ]);
  }

  nodeTitle(label: string): Locator {
    // Node Title with fallback strategies
    return this.locatorFallback.getLocatorWithOr([
      () => this.page.locator('.rct-node .rct-title', { hasText: label }),
      () => this.page.locator(`.rct-title:has-text("${label}")`),
      () => this.page.locator(`label:has-text("${label}")`),
      () => this.page.getByText(label, { exact: true })
    ]);
  }

  async expandAll(): Promise<void> {
    await this.expandAllButton.click();
  }

  async collapseAll(): Promise<void> {
    await this.collapseAllButton.click();
  }

  async toggleNode(label: string): Promise<void> {
    await this.nodeTitle(label).click();
  }

  async expectSelectionToContain(label: string): Promise<void> {
    await expect(this.resultSection).toContainText(label);
  }
}
