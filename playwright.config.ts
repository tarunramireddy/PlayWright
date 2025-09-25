import { defineConfig, devices } from '@playwright/test';
import { credentialsManager } from './src/config/config.manager';


const config = credentialsManager.getPlaywrightConfig();
const isCi = credentialsManager.isCi();

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); 
const branch = process.env.CI ? (process.env.GITHUB_REF_NAME || 'unknown') : 'local';
const reportSuffix = process.env.ARCHIVE_REPORTS === 'true' ? `/${timestamp}_${branch}` : '';

const baseResultsDir = 'test-results';
const htmlReportDir = `${baseResultsDir}/html${reportSuffix}`;
const allureResultsDir = `${baseResultsDir}/allure${reportSuffix}`;
const testResultsDir = `${baseResultsDir}/output${reportSuffix}`;
const junitFile = `${testResultsDir}/junit.xml`;
const jsonFile = `${testResultsDir}/results.json`;

export default defineConfig({
  testDir: './src/tests',
  
  fullyParallel: false,
  
  forbidOnly: !!isCi,
  
  retries: isCi ? config.retries : 0,
  
  workers: isCi ? config.workers : (config.workers || undefined),
  
  
  timeout: config.timeout,
  
  
  expect: {
    timeout: 10000,
  },

  
  reporter: [
    ['html', { outputFolder: htmlReportDir, open: 'never' }],
    ['allure-playwright', { outputFolder: allureResultsDir }],
    ['junit', { outputFile: junitFile }],
    ['json', { outputFile: jsonFile }],
    ...(isCi ? [['github'] as [string]] : [['list'] as [string]])
  ],

  
  outputDir: testResultsDir,

  
  use: {
    
    baseURL: config.baseUrl,

    
    trace: config.trace,
    
    
    screenshot: config.screenshot,
    
    
    video: config.video,
    
    
    headless: config.headless,
    
    
    launchOptions: {
      slowMo: config.slowMo,
    },
    
    
    navigationTimeout: config.timeout,
    
    
    actionTimeout: config.timeout / 2,
  },

  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },

    
  ],

  
  webServer: config.name === 'development' ? {
    command: 'npm run dev',
    url: config.baseUrl,
    reuseExistingServer: !isCi,
    timeout: 120 * 1000,
  } : undefined,
});
