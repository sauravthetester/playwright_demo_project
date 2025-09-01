import { Page, Locator, expect } from '@playwright/test';

export interface FormData {
    testId: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mobile: string;
    dateOfBirth: {
        day: string;
        month: string;
        year: string;
    };
    subjects: string[];
    hobbies: string[];
    currentAddress: string;
    state: string;
    city: string;
}

export class PracticeFormPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly mobileInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInput: Locator;
    readonly currentAddressInput: Locator;
    readonly stateDropdown: Locator;
    readonly cityDropdown: Locator;
    readonly submitButton: Locator;
    readonly modalDialog: Locator;
    readonly modalTitle: Locator;
    readonly modalCloseButton: Locator;
    readonly monthDropdown: Locator;
    readonly yearDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.emailInput = page.getByRole('textbox', { name: 'name@example.com' });
        this.mobileInput = page.getByRole('textbox', { name: 'Mobile Number' });
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');
        this.subjectsInput = page.locator('#subjectsInput');
        this.currentAddressInput = page.getByRole('textbox', { name: 'Current Address' });
        this.stateDropdown = page.locator('#state');
        this.cityDropdown = page.locator('#city');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.modalDialog = page.locator('.modal-dialog');
        this.modalTitle = page.locator('#example-modal-sizes-title-lg');
        this.modalCloseButton = page.locator('#closeLargeModal');
        this.monthDropdown = page.getByRole('combobox').first();
        this.yearDropdown = page.getByRole('combobox').nth(1);
    }

    async fillFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async selectGender(gender: string): Promise<void> {
        await this.page.getByText(gender, { exact: true }).click();
    }

    async fillMobile(mobile: string): Promise<void> {
        await this.mobileInput.fill(mobile);
    }

    async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
        // Click on date input to open calendar
        await this.dateOfBirthInput.click();
        
        // Select year
        await this.yearDropdown.selectOption(year);
        
        // Select month
        await this.monthDropdown.selectOption(month);
        
        // Select day
        await this.page.getByRole('option', { name: new RegExp(`Choose.*${day}.*${year}`) }).click();
    }

    async fillSubjects(subjects: string[]): Promise<void> {
        for (const subject of subjects) {
            await this.subjectsInput.click();
            await this.subjectsInput.type(subject);
            await this.page.getByText(subject, { exact: true }).first().click();
        }
    }

    async selectHobbies(hobbies: string[]): Promise<void> {
        for (const hobby of hobbies) {
            await this.page.getByText(hobby, { exact: true }).click();
        }
    }

    async fillCurrentAddress(address: string): Promise<void> {
        await this.currentAddressInput.fill(address);
    }

    async selectState(state: string): Promise<void> {
        await this.stateDropdown.click();
        await this.page.getByText(state, { exact: true }).click();
    }

    async selectCity(city: string): Promise<void> {
        await this.cityDropdown.click();
        await this.page.getByText(city, { exact: true }).click();
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click();
    }

    async fillCompleteForm(formData: FormData): Promise<void> {
        await this.fillFirstName(formData.firstName);
        await this.fillLastName(formData.lastName);
        await this.fillEmail(formData.email);
        await this.selectGender(formData.gender);
        await this.fillMobile(formData.mobile);
        await this.selectDateOfBirth(
            formData.dateOfBirth.day,
            formData.dateOfBirth.month,
            formData.dateOfBirth.year
        );
        await this.fillSubjects(formData.subjects);
        await this.selectHobbies(formData.hobbies);
        await this.fillCurrentAddress(formData.currentAddress);
        await this.selectState(formData.state);
        await this.selectCity(formData.city);
    }

    async verifyFormSubmission(formData: FormData): Promise<void> {
        // Wait for modal to appear
        await this.modalDialog.waitFor({ state: 'visible' });
        
        // Verify modal title
        await expect(this.modalTitle).toHaveText('Thanks for submitting the form');
        
        // Verify submitted data in modal
        const modalBody = this.page.locator('.modal-body');
        await expect(modalBody).toContainText(`${formData.firstName} ${formData.lastName}`);
        await expect(modalBody).toContainText(formData.email);
        await expect(modalBody).toContainText(formData.gender);
        await expect(modalBody).toContainText(formData.mobile);
        await expect(modalBody).toContainText(`${formData.dateOfBirth.day} ${formData.dateOfBirth.month},${formData.dateOfBirth.year}`);
        
        // Verify subjects
        for (const subject of formData.subjects) {
            await expect(modalBody).toContainText(subject);
        }
        
        // Verify hobbies
        for (const hobby of formData.hobbies) {
            await expect(modalBody).toContainText(hobby);
        }
        
        await expect(modalBody).toContainText(formData.currentAddress);
        await expect(modalBody).toContainText(`${formData.state} ${formData.city}`);
    }

    async closeModal(): Promise<void> {
        await this.modalCloseButton.click();
    }
}