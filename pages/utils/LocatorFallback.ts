import { Locator, Page } from '@playwright/test';

/**
 * Utility class to create locators with fallback strategies
 * Tries multiple locator strategies in order until one is found
 */
export class LocatorFallback {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Creates a locator that tries multiple strategies in order
     * @param strategies - Array of locator strategies to try
     * @param description - Optional description for debugging
     * @returns Combined locator with fallback support
     */
    async getLocatorWithFallback(
        strategies: (() => Locator)[],
        description: string = 'element'
    ): Promise<Locator> {
        if (strategies.length === 0) {
            throw new Error('At least one locator strategy must be provided');
        }

        // Try each strategy in order
        for (let i = 0; i < strategies.length; i++) {
            const locator = strategies[i]();
            const count = await locator.count();
            
            if (count > 0) {
                console.log(`✓ Found ${description} using strategy ${i + 1}/${strategies.length}`);
                return locator;
            }
        }

        // If no strategy works, return the first one (will fail gracefully with proper error)
        console.warn(`⚠ No fallback strategy found ${description}, using primary locator`);
        return strategies[0]();
    }

    /**
     * Creates a combined locator using Playwright's built-in or() method
     * More efficient than sequential checking
     * @param strategies - Array of locator strategies
     * @returns Combined locator
     */
    async getLocatorWithOr(
        strategies: Array<() => Locator | Promise<Locator>>,
        timeout = 3000
      ): Promise<Locator> {
        if (strategies.length === 0)
          throw new Error('At least one locator strategy must be provided');
      
        for (const getLocator of strategies) {
          const locator = await getLocator(); // handles both sync and async
          try {
            await locator.first().waitFor({ state: 'visible', timeout });
            console.log(`✅ Found locator: ${locator.toString()}`);
            return locator.first();
          } catch {
            // Not found yet, continue to next
          }
        }
      
        throw new Error('❌ No fallback locator found');
      }

    /**
     * Creates a locator with common fallback patterns for form inputs
     * @param primaryId - Primary ID selector
     * @param name - Name attribute or accessible name
     * @param placeholder - Placeholder text
     * @param label - Label text
     * @returns Combined locator
     */
    getInputLocator(
        primaryId?: string,
        name?: string,
        placeholder?: string,
        label?: string
    ): Promise<Locator> {
        const strategies: (() => Locator)[] = [];

        if (primaryId) {
            strategies.push(() => this.page.locator(`#${primaryId}`));
        }
        if (name) {
            strategies.push(() => this.page.getByRole('textbox', { name: name }));
        }
        if (placeholder) {
            strategies.push(() => this.page.getByPlaceholder(placeholder));
        }
        if (label) {
            strategies.push(() => this.page.getByLabel(label));
        }

        return this.getLocatorWithOr(strategies);
    }

    /**
     * Creates a locator with common fallback patterns for buttons
     * @param primaryId - Primary ID selector
     * @param text - Button text
     * @param role - Accessible role name
     * @returns Combined locator
     */
    getButtonLocator(
        primaryId?: string,
        text?: string,
        role: string = 'button'
    ): Promise<Locator> {
        const strategies: (() => Locator)[] = [];

        if (primaryId) {
            strategies.push(() => this.page.locator(`#${primaryId}`));
        }
        if (text) {
            strategies.push(() => this.page.getByRole('button', { name: text, exact: true }));
            strategies.push(() => this.page.getByText(text, { exact: true }));
        }

        return this.getLocatorWithOr(strategies);
    }
}
