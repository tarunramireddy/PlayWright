import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import Env from '../utils/Env';

test.describe('Rakuten Login', () => {
    let loginPage: LoginPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        await homePage.navigate(Env.BASE_URL);
    });

    test('should login successfully', async ({ page }) => {
        test.setTimeout(60000);
        await homePage.signInLink.click();
        await expect(loginPage.emailInput).toBeVisible({ timeout: 10000 });
        await loginPage.login(Env.USERNAME, Env.PASSWORD);
        await page.waitForTimeout(5000);
    });
});
