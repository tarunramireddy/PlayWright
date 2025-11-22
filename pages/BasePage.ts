import { Page, Locator, expect, test } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string = '/') {
        await this.page.goto(path);
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }

    async takeScreenshot(name: string) {
        const screenshot = await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
        await test.info().attach(name, { body: screenshot, contentType: 'image/png' });
    }
}
