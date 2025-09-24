import { Page, Locator } from '@playwright/test';
import { logger } from './logger';

/**
 * Wait utility class for common wait operations
 */
export class WaitUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(selector: string | Locator, timeout: number = 30000): Promise<void> {
    logger.step(`Waiting for element to be visible: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
    } else {
      await selector.waitFor({ state: 'visible', timeout });
    }
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string | Locator, timeout: number = 30000): Promise<void> {
    logger.step(`Waiting for element to be hidden: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, { state: 'hidden', timeout });
    } else {
      await selector.waitFor({ state: 'hidden', timeout });
    }
  }

  /**
   * Wait for element to be attached to DOM
   */
  async waitForAttached(selector: string | Locator, timeout: number = 30000): Promise<void> {
    logger.step(`Waiting for element to be attached: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, { state: 'attached', timeout });
    } else {
      await selector.waitFor({ state: 'attached', timeout });
    }
  }

  /**
   * Wait for text to be visible on page
   */
  async waitForText(text: string, timeout: number = 30000): Promise<void> {
    logger.step(`Waiting for text to appear: ${text}`);
    await this.page.waitForFunction(
      (searchText) => document.body.innerText.includes(searchText),
      text,
      { timeout }
    );
  }

  /**
   * Wait for URL to contain specific text
   */
  async waitForUrl(urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    logger.step(`Waiting for URL to match: ${urlPattern}`);
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    logger.step('Waiting for page to load completely');
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    logger.step('Waiting for network to be idle');
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for custom condition
   */
  async waitForCondition(
    condition: () => Promise<boolean> | boolean,
    options: { timeout?: number; interval?: number; timeoutMsg?: string } = {}
  ): Promise<void> {
    const { timeout = 30000, interval = 1000, timeoutMsg = 'Condition not met within timeout' } = options;
    
    logger.step('Waiting for custom condition');
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const result = await condition();
        if (result) {
          return;
        }
      } catch (error) {
        // Continue waiting if condition throws
      }
      
      await this.page.waitForTimeout(interval);
    }
    
    throw new Error(timeoutMsg);
  }

  /**
   * Wait with custom timeout
   */
  async wait(milliseconds: number): Promise<void> {
    logger.step(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }
}