import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import Env from '../utils/Env';

test.describe('Rakuten Home Page', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate(Env.BASE_URL);
    });

    test('has title', async () => {
        const title = await homePage.getTitle();
        expect(title).toContain('Rakuten');
    });

    test('has shop by category', async () => {
        const isVisible = await homePage.isShopByCategoryVisible();
        expect(isVisible).toBeTruthy();
    });

    test('take screenshot', async () => {
        await homePage.takeScreenshot('homepage');
    });
});
