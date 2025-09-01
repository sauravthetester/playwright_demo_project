import { expect, Locator, Page } from '@playwright/test';

export class CheckBoxPage {
  readonly expandAllButton: Locator;
  readonly collapseAllButton: Locator;
  readonly resultSection: Locator;

  constructor(private readonly page: Page) {
    this.expandAllButton = page.locator('button[title="Expand all"], .rct-option-expand-all');
    this.collapseAllButton = page.locator('button[title="Collapse all"], .rct-option-collapse-all');
    this.resultSection = page.locator('#result');
  }

  nodeTitle(label: string): Locator {
    return this.page.locator('.rct-node .rct-title', { hasText: label });
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


