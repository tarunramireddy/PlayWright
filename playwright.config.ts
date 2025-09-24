import { defineConfig, devices } from '@playwright/test';
import { configManager } from './src/config/config.manager';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Get configuration based on environment
const config = configManager.getConfig();
const isCi = configManager.isCi();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCi,
  /* Retry on CI only */
  retries: isCi ? config.retries : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCi ? config.workers : (config.workers || undefined),
  
  /* Global test timeout */
  timeout: config.timeout,
  
  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
  },

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(isCi ? [['github'] as [string]] : [['list'] as [string]])
  ],

  /* Output directory for artifacts */
  outputDir: 'test-results',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: config.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: config.trace,
    
    /* Take screenshot on failure */
    screenshot: config.screenshot,
    
    /* Record video */
    video: config.video,
    
    /* Headless mode */
    headless: config.headless,
    
    /* Slow down operations */
    launchOptions: {
      slowMo: config.slowMo,
    },
    
    /* Navigation timeout */
    navigationTimeout: config.timeout,
    
    /* Action timeout */
    actionTimeout: config.timeout / 2,
  },

  /* Configure projects for major browsers */
  projects: [
    // Temporarily disable setup project 
    // {
    //   name: 'setup',
    //   testMatch: /.*\.setup\.ts/,
    // },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Remove storage state dependency temporarily
        // storageState: 'test-results/.auth/user.json',
      },
      // dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // storageState: 'test-results/.auth/user.json',
      },
      // dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // storageState: 'test-results/.auth/user.json',
      },
      // dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // storageState: 'test-results/.auth/user.json',
      },
      // dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        // storageState: 'test-results/.auth/user.json',
      },
      // dependencies: ['setup'],
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: config.name === 'development' ? {
    command: 'npm run dev',
    url: config.baseUrl,
    reuseExistingServer: !isCi,
    timeout: 120 * 1000,
  } : undefined,
});
