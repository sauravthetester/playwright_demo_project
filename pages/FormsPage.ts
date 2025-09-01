import { Page, Locator } from '@playwright/test';

export class FormsPage {
    readonly page: Page;
    readonly practiceFormMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.practiceFormMenuItem = page.getByText('Practice Form');
    }

    async clickPracticeFormMenuItem(): Promise<void> {
        await this.practiceFormMenuItem.click();
    }
}