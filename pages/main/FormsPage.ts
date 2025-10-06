import { Page, Locator } from '@playwright/test';
import { LocatorFallback } from '../utils/LocatorFallback';

export class FormsPage {
    readonly page: Page;
    readonly practiceFormMenuItem: Promise<Locator>;
    private locatorFallback: LocatorFallback;

    constructor(page: Page) {
        this.page = page;
        this.locatorFallback = new LocatorFallback(page);

        // Practice Form Menu Item with fallback strategies
        this.practiceFormMenuItem = this.locatorFallback.getLocatorWithOr([
            () => page.getByText('Practice Form'),
            () => page.locator('li:has-text("Practice Form")'),
            () => page.getByRole('listitem').filter({ hasText: 'Practice Form' }),
            () => page.locator('.menu-list').getByText('Practice Form'),
            () => page.locator('span:has-text("Practice Form")')
        ]);
    }

    async clickPracticeFormMenuItem(): Promise<void> {
        await (await this.practiceFormMenuItem).click();
    }
}
