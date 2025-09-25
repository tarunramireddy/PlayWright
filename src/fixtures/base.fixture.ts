import {
  test as baseTest,
  Browser,
  BrowserContext,
  Page,
} from "@playwright/test";
import { LoginPage, HomePage } from "../pages/index";
import { logger, DataGenerator } from "../utils/index";
import { credentialsManager } from "../config/config.manager";

export interface TestFixtures {
  loginPage: LoginPage;
  homePage: HomePage;
  
  dataGenerator: typeof DataGenerator;
  
  // Dynamic user selection fixtures
  withUser: (userType: 'superAdmin' | 'allianceAdmin' | 'leaAdmin') => {
    email: string;
    password: string;
    description?: string;
  };
  
  // Legacy fixture for backward compatibility  
  testUser: {
    email: string;
    password: string;
  };
  
  // Dynamic authenticated context with user selection
  authenticatedContextWith: (userType: 'superAdmin' | 'allianceAdmin' | 'leaAdmin') => Promise<BrowserContext>;
  
  authenticatedContext: BrowserContext;
  
  authenticatedPage: Page;
}export interface WorkerFixtures {
  browserConfig: {
    headless: boolean;
    slowMo?: number;
    viewport?: { width: number; height: number };
  };
}

export const test = baseTest.extend<TestFixtures, WorkerFixtures>({
  browserConfig: [
    async ({}, use) => {
      const config = credentialsManager.getPlaywrightConfig();
      await use({
        headless: config.headless,
        slowMo: config.slowMo,
        viewport: { width: 1920, height: 1080 },
      });
    },
    { scope: "worker" },
  ],

  dataGenerator: async ({}, use) => {
    await use(DataGenerator);
  },

  withUser: async ({}, use) => {
    const getUserData = (userType: 'superAdmin' | 'allianceAdmin' | 'leaAdmin') => {
      const testUser = credentialsManager.getTestUser(userType);
      return {
        email: testUser.username,
        password: testUser.password,
        description: testUser.description,
      };
    };
    
    await use(getUserData);
  },

  authenticatedContextWith: async ({ browser }, use) => {
    const createAuthenticatedContext = async (userType: 'superAdmin' | 'allianceAdmin' | 'leaAdmin') => {
      const testUser = credentialsManager.getTestUser(userType);
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
      });

      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      
      logger.step(`Setting up authenticated context for ${userType}`);
      
      try {
        await loginPage.navigate();
        await loginPage.login(testUser.username, testUser.password);
        
        const homePage = new HomePage(page);
        await homePage.waitForPageLoad();
        
        logger.info(`Authentication successful for ${userType}: ${testUser.username}`);
      } catch (error) {
        logger.error(`Failed to authenticate ${userType}`, error);
        throw error;
      } finally {
        await page.close();
      }

      return context;
    };
    
    await use(createAuthenticatedContext);
  },

  testUser: async ({ dataGenerator }, use) => {
    const testUser = credentialsManager.getTestUser("allianceAdmin");

    const userData = {
      email: testUser.username,
      password: testUser.password,
    };

    logger.info(`Using test user: ${userData.email}`);
    await use(userData);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  authenticatedContext: async ({ browser, testUser }, use) => {
    const config = credentialsManager.getPlaywrightConfig();

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    logger.step("Setting up authenticated context");

    try {
      await loginPage.navigate();
      await loginPage.login(testUser.email, testUser.password);

      const homePage = new HomePage(page);
      await homePage.waitForPageLoad();

      logger.info("Authentication successful for test context");
    } catch (error) {
      logger.error("Failed to authenticate test context", error);
      throw error;
    } finally {
      await page.close();
    }

    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },
});

export class BaseTest {
  protected static config = credentialsManager.getPlaywrightConfig();

  static async beforeAll(): Promise<void> {
    logger.info("Starting test suite setup");
    logger.info(`Running tests against: ${this.config.baseUrl}`);
    logger.info(`Environment: ${this.config.name}`);
  }

  static async afterAll(): Promise<void> {
    logger.info("Test suite cleanup completed");
  }

  static async beforeEach(testInfo: any): Promise<void> {
    logger.testStart(testInfo.title);
    logger.info(`Test: ${testInfo.title}`);
    logger.info(`File: ${testInfo.file}`);
  }

  static async afterEach(testInfo: any): Promise<void> {
    const status = testInfo.status?.toUpperCase() || "UNKNOWN";
    logger.testEnd(testInfo.title, status as any);

    if (testInfo.status === "failed") {
      logger.error(`Test failed: ${testInfo.title}`, testInfo.error);
    }
  }

  static async takeScreenshotOnFailure(
    page: Page,
    testInfo: any
  ): Promise<void> {
    if (testInfo.status === "failed") {
      const screenshot = await page.screenshot({
        path: `test-results/screenshots/failure-${
          testInfo.title
        }-${Date.now()}.png`,
        fullPage: true,
      });

      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });

      logger.info("Screenshot captured for failed test");
    }
  }
}

export { expect } from "@playwright/test";