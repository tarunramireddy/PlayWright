import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '@utils/index';
import * as loc from '../utils/locator.helper';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly loginWithSystem: Locator;

  constructor(page: Page) {
    super(page);
    this.loginWithSystem = loc.text(page, 'Login with system username and password');
    this.emailInput = loc.css(page, '#email');   
    this.passwordInput = loc.css(page, '#password'); 
    this.loginButton = loc.text(page, ' Login with system username and password');
    this.forgotPasswordLink = loc.xpath(page, '//a[contains(text(), "Forgot")]');
    
  }

  /**
   * Get login page URL
   */
  getUrl(): string {
    return `${this.config.baseUrl}/login`;
  }

  /**
   * Check if login page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.verifyElementVisible(this.loginWithSystem);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Enter email address
   */
  async enterEmail(email: string): Promise<void> {
    logger.step(`Entering email: ${email}`);
    await this.fill(this.emailInput, email, { clear: true });
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    logger.step('Entering password');
    await this.fill(this.passwordInput, password, { clear: true });
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    logger.step('Clicking login button');
    await this.click(this.loginButton);
  }


  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    logger.step('Clicking forgot password link');
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Wait for loading to complete
   */
//   async waitForLoginComplete(): Promise<void> {
//     logger.step('Waiting for login to complete');
//     try {
//       // Wait for loading spinner to disappear
//       await this.waitUtils.waitForHidden(this.loadingSpinner, 5000);
//     } catch {
//       // Loading spinner might not appear for fast logins
//     }
//   }
async clickLoginWithSystem(): Promise<void> {
  logger.step('Clicking login with system');
  await this.click(this.loginWithSystem);
}
  
  /**
   * Verify login form elements are present
   */
  async verifyLoginFormElements(): Promise<void> {
    logger.step('Verifying login form elements');
    await this.verifyElementVisible(this.emailInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
    await this.verifyElementVisible(this.forgotPasswordLink);
  }
async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    logger.step('Clearing login form');
    await this.fill(this.emailInput, '');
    await this.fill(this.passwordInput, '');
  }
}
