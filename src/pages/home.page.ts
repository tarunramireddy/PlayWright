import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../utils/logger";

export class HomePage extends BasePage {
  private readonly header: Locator;
  private readonly mainContent: Locator;

  constructor(page: Page) {
    super(page);
    this.header = this.locator('[data-testid="header"]');
    this.mainContent = this.locator('[data-testid="main-content"]');
  }

  getUrl(): string {
    return `${this.config.baseUrl}/home`;
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.verifyElementVisible(this.header);
      await this.verifyElementVisible(this.mainContent);
      return true;
    } catch {
      return false;
    }
  }

  async waitForPageToLoad(): Promise<void> {
    logger.step("Waiting for home page to fully load");
    await this.waitForPageLoad();
    await this.waitForElement(this.header);
    await this.waitForElement(this.mainContent);
  }
}
