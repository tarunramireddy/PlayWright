import { BasePage } from './BasePage';
import { Locator, Page, FrameLocator } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInBtn: Locator;
    readonly authFrame: FrameLocator;

    constructor(page: Page) {
        super(page);
        this.authFrame = page.frameLocator('iframe[id^="appshell-auth-modal-iframe"]').first();
        this.emailInput = this.authFrame.locator('input#emailAddress').or(page.locator('input#emailAddress'));
        this.passwordInput = this.authFrame.locator('input#password').or(page.locator('input#password'));
        this.signInBtn = this.authFrame.locator('button#email-auth-btn').or(page.locator('button#email-auth-btn'));
    }

    async login(username: string, pass: string) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(pass);
        await this.signInBtn.click({ force: true });
    }
}
