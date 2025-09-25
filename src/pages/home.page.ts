import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { logger } from "../utils/logger";
import { getUser, UserType } from "../utils/user.manager";
import * as loc from "../utils/locator.helper";

export class HomePage extends BasePage {
  private readonly allianceDashboard: Locator;
  private readonly leaDashboard: Locator;
  private readonly superadminDashboard: Locator;

  constructor(page: Page) {
    super(page);
    this.allianceDashboard = loc.xpath(page, "//*[text()='Alliance Dashboard']");
    this.leaDashboard = loc.xpath(page, "//*[text()='School District Dashboard']");
    this.superadminDashboard = loc.xpath(page, "//*[text()='Super Admin Dashboard']");
  }

  getUrl(): string {
    return `${this.config.baseUrl}/home`;
  }

  async isLoaded(): Promise<boolean> {
    try {
      await Promise.race([
        this.verifyElementVisible(this.allianceDashboard),
        this.verifyElementVisible(this.leaDashboard),
        this.verifyElementVisible(this.superadminDashboard)
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async verifyLoginCheck(userType: UserType): Promise<void> {
    const user = getUser(userType);
    logger.step(`Verifying dashboard for ${userType}: ${user.email}`);
    
    switch (userType) {
      case 'superAdmin':
        await this.verifyElementVisible(this.superadminDashboard);
        logger.info('Super Admin Dashboard verified');
        break;
      case 'allianceAdmin':
        await this.verifyElementVisible(this.allianceDashboard);
        logger.info('Alliance Dashboard verified');
        break;
      case 'leaAdmin':
        await this.verifyElementVisible(this.leaDashboard);
        logger.info('LEA Dashboard verified');
        break;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  }
}

