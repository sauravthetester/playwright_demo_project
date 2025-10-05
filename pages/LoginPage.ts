import { expect, Locator, Page } from '@playwright/test';
import { LocatorFallback } from '../pages/utils/LocatorFallback';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly logoutButton: Locator;
  private locatorFallback: LocatorFallback;

  constructor(private readonly page: Page) {
    this.locatorFallback = new LocatorFallback(page);

    // Username Input with fallback strategies
    this.usernameInput = this.locatorFallback.getInputLocator(
      'username',
      'Username',
      'Username',
      'Username'
    );

    // Password Input with fallback strategies
    this.passwordInput = this.locatorFallback.getLocatorWithOr([
      () => page.locator('#password'),
      () => page.getByRole('textbox', { name: 'Password' }),
      () => page.getByPlaceholder('Password'),
      () => page.locator('input[type="password"]'),
      () => page.getByLabel('Password')
    ]);

    // Login Button with fallback strategies
    this.loginButton = this.locatorFallback.getButtonLocator(
      undefined,
      'Login'
    );

    // Success Message with fallback strategies
    this.successMessage = this.locatorFallback.getLocatorWithOr([
      () => page.locator('.alert-success'),
      () => page.locator('[role="alert"]'),
      () => page.getByText('You logged into a secure area!'),
      () => page.locator('.flash.success')
    ]);

    // Logout Button with fallback strategies
    this.logoutButton = this.locatorFallback.getLocatorWithOr([
      () => page.getByRole('link', { name: 'Logout' }),
      () => page.getByRole('button', { name: 'Logout' }),
      () => page.locator('a:has-text("Logout")'),
      () => page.locator('[href*="logout"]')
    ]);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('https://practice.expandtesting.com/login');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }

  async fastForwardTime(time: string): Promise<void> {
    await this.page.clock.fastForward(time);
  }

  async clearSessionCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  async performSessionExpirationTest(): Promise<void> {
    await this.fastForwardTime('30:00');
    await this.clearSessionCookies();
    await this.reloadPage();
  }
}
