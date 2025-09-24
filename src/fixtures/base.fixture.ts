import { test as baseTest, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage, HomePage } from '@pages/index';
import { logger, DataGenerator } from '@utils/index';
import { configManager } from '@config/config.manager';

/**
 * Extended test fixtures interface
 */
export interface TestFixtures {
  // Page objects
  loginPage: LoginPage;
  homePage: HomePage;
  
  // Utilities
  dataGenerator: typeof DataGenerator;
  
  // Test data
  testUser: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  
  // Browser context with storage state
  authenticatedContext: BrowserContext;
  
  // Authenticated page
  authenticatedPage: Page;
}

/**
 * Worker-scoped fixtures interface
 */
export interface WorkerFixtures {
  // Browser setup
  browserConfig: {
    headless: boolean;
    slowMo?: number;
    viewport?: { width: number; height: number };
  };
}

/**
 * Extended test with custom fixtures
 */
export const test = baseTest.extend<TestFixtures, WorkerFixtures>({
  /**
   * Browser configuration fixture (worker-scoped)
   */
  browserConfig: [async ({}, use) => {
    const config = configManager.getConfig();
    await use({
      headless: config.headless,
      slowMo: config.slowMo,
      viewport: { width: 1920, height: 1080 }
    });
  }, { scope: 'worker' }],

  /**
   * Data generator fixture
   */
  dataGenerator: async ({}, use) => {
    await use(DataGenerator);
  },

  /**
   * Test user fixture - generates fresh test data for each test
   */
  testUser: async ({ dataGenerator }, use) => {
    const config = configManager.getConfig();
    
    // Use known credentials if available, otherwise generate random ones
    const testUser = {
      email: process.env.TEST_USER_EMAIL || config.credentials?.username || dataGenerator.generateEmail(),
      password: process.env.TEST_USER_PASSWORD || config.credentials?.password || dataGenerator.generatePassword(),
      firstName: dataGenerator.generateUser().firstName,
      lastName: dataGenerator.generateUser().lastName
    };
    
    logger.info(`Using test user: ${testUser.email}`);
    await use(testUser);
  },

  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Home page fixture
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Authenticated context fixture - creates a context with authentication
   */
  authenticatedContext: async ({ browser, testUser }, use) => {
    const config = configManager.getConfig();
    
    // Create new context
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    // Perform authentication
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    logger.step('Setting up authenticated context');
    
    try {
      await loginPage.navigate();
      await loginPage.login(
        config.credentials?.username || testUser.email,
        config.credentials?.password || testUser.password
      );
      
      // Wait for successful login
      const homePage = new HomePage(page);
      await homePage.waitForPageToLoad();
      
      logger.info('Authentication successful for test context');
    } catch (error) {
      logger.error('Failed to authenticate test context', error);
      throw error;
    } finally {
      await page.close();
    }

    await use(context);
    await context.close();
  },

  /**
   * Authenticated page fixture - provides a page with authentication
   */
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  }
});

/**
 * Base test class with common setup and teardown
 */
export class BaseTest {
  protected static config = configManager.getConfig();

  /**
   * Setup method to run before all tests in a suite
   */
  static async beforeAll(): Promise<void> {
    logger.info('Starting test suite setup');
    logger.info(`Running tests against: ${this.config.baseUrl}`);
    logger.info(`Environment: ${this.config.name}`);
  }

  /**
   * Teardown method to run after all tests in a suite
   */
  static async afterAll(): Promise<void> {
    logger.info('Test suite cleanup completed');
  }

  /**
   * Setup method to run before each test
   */
  static async beforeEach(testInfo: any): Promise<void> {
    logger.testStart(testInfo.title);
    logger.info(`Test: ${testInfo.title}`);
    logger.info(`File: ${testInfo.file}`);
  }

  /**
   * Teardown method to run after each test
   */
  static async afterEach(testInfo: any): Promise<void> {
    const status = testInfo.status?.toUpperCase() || 'UNKNOWN';
    logger.testEnd(testInfo.title, status as any);
    
    if (testInfo.status === 'failed') {
      logger.error(`Test failed: ${testInfo.title}`, testInfo.error);
    }
  }

  /**
   * Take screenshot on failure
   */
  static async takeScreenshotOnFailure(page: Page, testInfo: any): Promise<void> {
    if (testInfo.status === 'failed') {
      const screenshot = await page.screenshot({ 
        path: `test-results/screenshots/failure-${testInfo.title}-${Date.now()}.png`,
        fullPage: true 
      });
      
      await testInfo.attach('screenshot', { 
        body: screenshot, 
        contentType: 'image/png' 
      });
      
      logger.info('Screenshot captured for failed test');
    }
  }
}

/**
 * Export expect for convenience
 */
export { expect } from '@playwright/test';