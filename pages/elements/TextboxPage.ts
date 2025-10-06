import { expect, Locator, Page } from '@playwright/test';
import { LocatorFallback } from '../utils/LocatorFallback';

export class TextboxPage {
  textBox: Promise<Locator>;
  userName: Promise<Locator>;
  userEmail: Promise<Locator>;
  currentAddress: Promise<Locator>;
  permanentAddress: Promise<Locator>;
  submitButton: Promise<Locator>;
  private locatorFallback: LocatorFallback;

  constructor(private readonly page: Page) {
    this.locatorFallback = new LocatorFallback(page);

    // Text Box menu item with fallback strategies
    this.textBox = this.locatorFallback.getLocatorWithOr([
      () => page.locator('text=Text Box'),
      () => page.getByText('Text Box', { exact: true }),
      () => page.locator('span:has-text("Text Box")'),
      () => page.locator('[class*="text"]:has-text("Text Box")')
    ]);

    // User Name input with fallback strategies
    this.userName = this.locatorFallback.getInputLocator(
      'userName',
      'Full Name',
      'Full Name',
      'Full Name'
    );

    // User Email input with fallback strategies
    this.userEmail = this.locatorFallback.getInputLocator(
      'userEmail',
      'Email',
      'name@example.com',
      'Email'
    );

    // Current Address with fallback strategies
    this.currentAddress = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#currentAddress'),
      () => page.getByPlaceholder('Current Address'),
      () => page.locator('textarea[placeholder*="Current Address"]'),
      () => page.locator('textarea[id="currentAddress"]')
    ]);

    // Permanent Address with fallback strategies
    this.permanentAddress = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#permanentAddress'),
      () => page.locator('textarea[id="permanentAddress"]'),
      () => page.locator('textarea').nth(1),
      () => page.locator('[placeholder*="Permanent"]')
    ]);

    // Submit Button with fallback strategies
    this.submitButton = this.locatorFallback.getButtonLocator(
      'submit',
      'Submit'
    );
  }

  async fillTextBoxesAndSubmit(data: { name: string; email: string; currentAddress: string; permanentAddress: string }) {
    await (await this.userName).fill(data.name);
    await (await this.userEmail).fill(data.email);
    await (await this.currentAddress).fill(data.currentAddress);
    await (await this.permanentAddress).fill(data.permanentAddress);
    await (await this.submitButton).click();
  }

  async verifySubmission(data: { name: string; email: string; currentAddress: string; permanentAddress: string }) {
    // Output section with fallback strategies
    const outputSection = this.locatorFallback.getLocatorWithOr([
      () => this.page.locator('#output'),
      () => this.page.locator('.border'),
      () => this.page.locator('body')
    ]);

    await expect(await outputSection).toContainText(`Name:${data.name}`);
    await expect(await outputSection).toContainText(`Email:${data.email}`);
    await expect(await outputSection).toContainText(`Current Address :${data.currentAddress}`);
    await expect(await outputSection).toContainText(`Permananet Address :${data.permanentAddress}`);
  }
}
