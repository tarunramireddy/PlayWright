import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    headless: false,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        // Remove device to avoid deviceScaleFactor conflict
        viewport: null,
        headless: false,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
