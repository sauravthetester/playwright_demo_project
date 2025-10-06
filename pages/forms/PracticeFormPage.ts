import { Page, Locator, expect } from '@playwright/test';
import { LocatorFallback } from '../utils/LocatorFallback';

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
    readonly firstNameInput: Promise<Locator>;
    readonly lastNameInput: Promise<Locator>;
    readonly emailInput: Promise<Locator>;
    readonly mobileInput: Promise<Locator>;
    readonly dateOfBirthInput: Promise<Locator>;
    readonly subjectsInput: Promise<Locator>;
    readonly currentAddressInput: Promise<Locator>;
    readonly stateDropdown: Promise<Locator>;
    readonly cityDropdown: Promise<Locator>;
    readonly submitButton: Promise<Locator>;
    readonly modalDialog: Promise<Locator>;
    readonly modalTitle: Promise<Locator>;
    readonly modalCloseButton: Promise<Locator>;
    readonly monthDropdown: Promise<Locator>;
    readonly yearDropdown: Promise<Locator>;
    private locatorFallback: LocatorFallback;

    constructor(page: Page) {
        this.page = page;
        this.locatorFallback = new LocatorFallback(page);

        // First Name Input with fallback strategies
        this.firstNameInput = this.locatorFallback.getInputLocator(
            'firstName',
            'First Name',
            'First Name',
            'First Name'
        );

        // Last Name Input with fallback strategies
        this.lastNameInput = this.locatorFallback.getInputLocator(
            'lastName',
            'Last Name',
            'Last Name',
            'Last Name'
        );

        // Email Input with fallback strategies
        this.emailInput = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#userEmail'),
            () => page.getByRole('textbox', { name: 'name@example.com' }),
            () => page.getByPlaceholder('name@example.com'),
            () => page.locator('input[type="email"]'),
            () => page.locator('input[placeholder*="example.com"]')
        ]);

        // Mobile Input with fallback strategies
        this.mobileInput = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#userNumber'),
            () => page.getByRole('textbox', { name: 'Mobile Number' }),
            () => page.getByPlaceholder('Mobile Number'),
            () => page.locator('input[placeholder*="Mobile"]')
        ]);

        // Date of Birth Input with fallback strategies
        this.dateOfBirthInput = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#dateOfBirthInput'),
            () => page.locator('input[id="dateOfBirthInput"]'),
            () => page.locator('.react-datepicker__input-container input'),
            () => page.locator('input[placeholder*="Date"]')
        ]);

        // Subjects Input with fallback strategies
        this.subjectsInput = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#subjectsInput'),
            () => page.locator('input[id="subjectsInput"]'),
            () => page.locator('.subjects-auto-complete__input input'),
            () => page.locator('input[placeholder*="Subjects"]')
        ]);

        // Current Address Input with fallback strategies
        this.currentAddressInput = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#currentAddress'),
            () => page.getByRole('textbox', { name: 'Current Address' }),
            () => page.getByPlaceholder('Current Address'),
            () => page.locator('textarea[placeholder*="Current Address"]')
        ]);

        // State Dropdown with fallback strategies
        this.stateDropdown = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#state'),
            () => page.locator('#state .css-1wa3eu0-placeholder'),
            () => page.locator('#state input'),
            () => page.locator('div[id="state"]')
        ]);

        // City Dropdown with fallback strategies
        this.cityDropdown = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#city'),
            () => page.locator('#city .css-1wa3eu0-placeholder'),
            () => page.locator('#city input'),
            () => page.locator('div[id="city"]')
        ]);

        // Submit Button with fallback strategies
        this.submitButton = this.locatorFallback.getButtonLocator(
            'submit',
            'Submit'
        );

        // Modal Dialog with fallback strategies
        this.modalDialog = this.locatorFallback.getLocatorWithOr([
            () => page.locator('.modal-dialog'),
            () => page.locator('[role="dialog"]'),
            () => page.locator('.modal-content'),
            () => page.locator('div.modal')
        ]);

        // Modal Title with fallback strategies
        this.modalTitle = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#example-modal-sizes-title-lg'),
            () => page.locator('.modal-title'),
            () => page.locator('h4:has-text("Thanks for submitting")'),
            () => page.locator('[class*="modal-title"]')
        ]);

        // Modal Close Button with fallback strategies
        this.modalCloseButton = this.locatorFallback.getLocatorWithOr([
            () => page.locator('#closeLargeModal'),
            () => page.locator('button:has-text("Close")'),
            () => page.locator('.modal button[type="button"]'),
            () => page.locator('.close')
        ]);

        // Month Dropdown with fallback strategies
        this.monthDropdown = this.locatorFallback.getLocatorWithOr([
            () => page.getByRole('combobox').first(),
            () => page.locator('.react-datepicker__month-select'),
            () => page.locator('select.react-datepicker__month-select')
        ]);

        // Year Dropdown with fallback strategies
        this.yearDropdown = this.locatorFallback.getLocatorWithOr([
            () => page.getByRole('combobox').nth(1),
            () => page.locator('.react-datepicker__year-select'),
            () => page.locator('select.react-datepicker__year-select')
        ]);
    }

    async fillFirstName(firstName: string): Promise<void> {
        await (await this.firstNameInput).fill(firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await (await this.lastNameInput).fill(lastName);
    }

    async fillEmail(email: string): Promise<void> {
        await (await this.emailInput).fill(email);
    }

    async selectGender(gender: string): Promise<void> {
        // Gender selection with fallback strategies
        const genderLocator = await this.locatorFallback.getLocatorWithOr([
            () => this.page.getByText(gender, { exact: true }),
            () => this.page.locator(`label:has-text("${gender}")`),
            () => this.page.locator(`input[value="${gender}"] + label`),
            () => this.page.locator(`label[for*="${gender.toLowerCase()}"]`)
        ]);
        await genderLocator.click();
    }

    async fillMobile(mobile: string): Promise<void> {
        await (await this.mobileInput).fill(mobile);
    }

    async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
        // Click on date input to open calendar
        await (await this.dateOfBirthInput).click();
        
        // Select year
        await (await this.yearDropdown).selectOption(year);
        
        // Select month
        await (await this.monthDropdown).selectOption(month);
        
        // Select day with fallback strategies
        const dayLocator = await this.locatorFallback.getLocatorWithOr([
            () => this.page.getByRole('option', { name: new RegExp(`Choose.*${day}.*${year}`) }),
            () => this.page.locator(`.react-datepicker__day--0${day.padStart(2, '0')}`),
            () => this.page.locator(`.react-datepicker__day:has-text("${day}")`).first()
        ]);
        await dayLocator.click();
    }

    async fillSubjects(subjects: string[]): Promise<void> {
        for (const subject of subjects) {
            await (await this.subjectsInput).click();
            await (await this.subjectsInput).fill(subject);
            await (await this.subjectsInput).press('Enter');
        }
    }

    async selectHobbies(hobbies: string[]): Promise<void> {
        for (const hobby of hobbies) {
            // Hobby selection with fallback strategies
            const hobbyLocator = await this.locatorFallback.getLocatorWithOr([
                () => this.page.getByText(hobby, { exact: true }),
                () => this.page.locator(`label:has-text("${hobby}")`),
                () => this.page.locator(`input[value="${hobby}"] + label`),
                () => this.page.locator(`label[for*="${hobby.toLowerCase()}"]`)
            ]);
            await hobbyLocator.click();
        }
    }

    async fillCurrentAddress(address: string): Promise<void> {
        await (await this.currentAddressInput).fill(address);
    }

    async selectState(state: string): Promise<void> {
        await (await this.stateDropdown).click();
        
        // State option with fallback strategies
        const stateOption = await this.locatorFallback.getLocatorWithOr([
            () => this.page.getByText(state, { exact: true }),
            () => this.page.locator(`div[id*="react-select"]:has-text("${state}")`),
            () => this.page.locator(`[class*="option"]:has-text("${state}")`)
        ]);
        await stateOption.click();
    }

    async selectCity(city: string): Promise<void> {
        await (await this.cityDropdown).click();
        
        // City option with fallback strategies
        const cityOption = await this.locatorFallback.getLocatorWithOr([
            () => this.page.getByText(city, { exact: true }),
            () => this.page.locator(`div[id*="react-select"]:has-text("${city}")`),
            () => this.page.locator(`[class*="option"]:has-text("${city}")`)
        ]);
        await cityOption.click();
    }

    async submitForm(): Promise<void> {
        await (await this.submitButton).click();
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
        await (await this.modalDialog).waitFor({ state: 'visible' });
        
        // Verify modal title
        await expect(await this.modalTitle).toHaveText('Thanks for submitting the form');
        
        // Verify submitted data in modal with fallback strategy
        const modalBody = this.locatorFallback.getLocatorWithOr([
            () => this.page.locator('.modal-body'),
            () => this.page.locator('[class*="modal-body"]'),
            async () => (await this.modalDialog).locator('tbody')
        ]);

        await expect(await modalBody).toContainText(`${formData.firstName} ${formData.lastName}`);
        await expect(await modalBody).toContainText(formData.email);
        await expect(await modalBody).toContainText(formData.gender);
        await expect(await modalBody).toContainText(formData.mobile);
        await expect(await modalBody).toContainText(`${formData.dateOfBirth.day} ${formData.dateOfBirth.month},${formData.dateOfBirth.year}`);
        
        // Verify subjects
        for (const subject of formData.subjects) {
            await expect(await modalBody).toContainText(subject);
        }
        
        // Verify hobbies
        for (const hobby of formData.hobbies) {
            await expect(await modalBody).toContainText(hobby);
        }
        
        await expect(await modalBody).toContainText(formData.currentAddress);
        await expect(await modalBody).toContainText(`${formData.state} ${formData.city}`);
    }

    async closeModal(): Promise<void> {
        await (await this.modalCloseButton).click();
    }
}
