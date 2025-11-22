import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class HomePage extends BasePage {
    readonly shopByCategoryBtn: Locator;
    readonly signInLink: Locator;

    constructor(page: Page) {
        super(page);
        this.shopByCategoryBtn = page.getByText('Shop by Category');
        this.signInLink = page.getByRole('link', { name: 'Sign In' });
    }

    async openShopByCategory() {
        await this.shopByCategoryBtn.click();
    }

    async isShopByCategoryVisible(): Promise<boolean> {
        return await this.shopByCategoryBtn.isVisible();
    }
}
