import { expect, Locator, Page } from '@playwright/test';

export class WebTablesPage {
  // Buttons & Inputs
  readonly addButton: Locator;
  readonly searchBox: Locator;

  // Modal form inputs
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly ageInput: Locator;
  readonly salaryInput: Locator;
  readonly departmentInput: Locator;
  readonly submitButton: Locator;

  // Table rows
  readonly tableRows: Locator;
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;

  constructor(private readonly page: Page) {
    this.addButton = page.locator('#addNewRecordButton');
    this.searchBox = page.locator('#searchBox');

    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.ageInput = page.locator('#age');
    this.salaryInput = page.locator('#salary');
    this.departmentInput = page.locator('#department');
    this.submitButton = page.locator('#submit');

    this.tableRows = page.locator('.rt-tbody .rt-tr-group');
    this.editButtons = page.locator('span[title="Edit"]');
    this.deleteButtons = page.locator('span[title="Delete"]');
  }

  async addRecord(data: {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
  }): Promise<void> {
    await this.addButton.click();
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.ageInput.fill(data.age);
    await this.salaryInput.fill(data.salary);
    await this.departmentInput.fill(data.department);
    await this.submitButton.click();
  }

  async searchByName(name: string): Promise<void> {
    await this.searchBox.fill(name);
  }

  async expectRowToContain(text: string): Promise<void> {
    await expect(this.tableRows).toContainText(text);
  }

  async deleteFirstRow(): Promise<void> {
    await this.deleteButtons.first().click();
  }

  async editFirstRow(updates: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
  }>): Promise<void> {
    await this.editButtons.first().click();
    if (updates.firstName) await this.firstNameInput.fill(updates.firstName);
    if (updates.lastName) await this.lastNameInput.fill(updates.lastName);
    if (updates.email) await this.emailInput.fill(updates.email);
    if (updates.age) await this.ageInput.fill(updates.age);
    if (updates.salary) await this.salaryInput.fill(updates.salary);
    if (updates.department) await this.departmentInput.fill(updates.department);
    await this.submitButton.click();
  }
}
