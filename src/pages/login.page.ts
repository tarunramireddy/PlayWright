import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../utils/index";
import * as loc from "../utils/locator.helper";

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly loginWithSystem: Locator;

  constructor(page: Page) {
    super(page);
    this.loginWithSystem = loc.text(
      page,
      "Login with system username and password"
    );
    this.emailInput = loc.css(page, "#email");
    this.passwordInput = loc.css(page, "#password");
    this.loginButton = loc.text(
      page,
      " Login with system username and password"
    );
    this.forgotPasswordLink = loc.xpath(
      page,
      '//a[contains(text(), "Forgot")]'
    );
  }

  getUrl(): string {
    return `${this.config.baseUrl}/`;
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.verifyElementVisible(this.loginWithSystem);
      return true;
    } catch {
      return false;
    }
  }

  async enterEmail(email: string): Promise<void> {
    logger.step(`Entering email: ${email}`);
    await this.fill(this.emailInput, email, { clear: true });
  }

  async enterPassword(password: string): Promise<void> {
    logger.step("Entering password");
    await this.fill(this.passwordInput, password, { clear: true });
  }

  async clickLoginButton(): Promise<void> {
    logger.step("Clicking login button");
    await this.click(this.loginButton);
  }

  async clickForgotPassword(): Promise<void> {
    logger.step("Clicking forgot password link");
    await this.click(this.forgotPasswordLink);
  }

  async clickLoginWithSystem(): Promise<void> {
    logger.step("Clicking login with system");
    await this.click(this.loginWithSystem);
  }

  async verifyLoginFormElements(): Promise<void> {
    logger.step("Verifying login form elements");
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
  async clearForm(): Promise<void> {
    logger.step("Clearing login form");
    await this.fill(this.emailInput, "");
    await this.fill(this.passwordInput, "");
  }
}
