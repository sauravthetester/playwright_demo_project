import { expect, Locator, Page } from '@playwright/test';

export class TextboxPage {

  textBox:Locator;
  userName: Locator;
  userEmail: Locator;
  currentAddress: Locator;
  permanentAddress: Locator;
  submitButton: Locator;

  constructor(private readonly page: Page) {
      this.textBox = page.locator('text=Text Box');
      this.userName = page.locator('#userName');
      this.userEmail = page.locator('#userEmail');
      this.currentAddress = page.locator('#currentAddress');
      this.permanentAddress = page.locator('#permanentAddress');
      this.submitButton = page.locator('#submit');

  }

  async fillTextBoxesAndSubmit(data: { name: string; email: string; currentAddress: string ; permanentAddress: string }) {
    await this.userName.fill(data.name);
    await this.userEmail.fill(data.email);
    await this.currentAddress.fill(data.currentAddress);
    await this.permanentAddress.fill(data.permanentAddress);
    await this.submitButton.click();
  }

  async verifySubmission(data: { name: string; email: string; currentAddress: string; permanentAddress: string }) {
    await expect(this.page.locator('body')).toContainText(`Name:${data.name}`);
    await expect(this.page.locator('body')).toContainText(`Email:${data.email}`);
    await expect(this.page.locator('body')).toContainText(`Current Address :${data.currentAddress}`); 
    await expect(this.page.locator('body')).toContainText(`Permananet Address :${data.permanentAddress}`);
  }
}
