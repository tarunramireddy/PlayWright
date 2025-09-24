import { Page, Locator, expect } from '@playwright/test';
import { WaitUtils, logger } from '@utils/index';
import { configManager } from '@config/config.manager';

/**
 * Base page class with common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;
  protected waitUtils: WaitUtils;
  protected config = configManager.getConfig();

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * Abstract method to verify page is loaded
   * Each page should implement this method
   */
  abstract isLoaded(): Promise<boolean>;

  /**
   * Abstract method to get page URL pattern
   */
  abstract getUrl(): string;

  /**
   * Navigate to page
   */
  async navigate(url?: string): Promise<void> {
    const targetUrl = url || this.getUrl();
    logger.step(`Navigating to: ${targetUrl}`);
    await this.page.goto(targetUrl);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    logger.step('Waiting for page to load');
    await this.waitUtils.waitForPageLoad();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    logger.step('Getting page title');
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    logger.step('Getting current URL');
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    logger.step(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ 
      fullPage: true,
      path: `test-results/screenshots/${screenshotName}.png`
    });
  }

  /**
   * Click element with retry mechanism
   */
  async click(selector: string | Locator, options?: { timeout?: number; force?: boolean }): Promise<void> {
    logger.step(`Clicking element: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      await this.page.click(selector, options);
    } else {
      await this.waitUtils.waitForVisible(selector);
      await selector.click(options);
    }
  }

  /**
   * Double click element
   */
  async doubleClick(selector: string | Locator): Promise<void> {
    logger.step(`Double clicking element: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      await this.page.dblclick(selector);
    } else {
      await this.waitUtils.waitForVisible(selector);
      await selector.dblclick();
    }
  }

  /**
   * Fill input field
   */
  async fill(selector: string | Locator, text: string, options?: { clear?: boolean }): Promise<void> {
    logger.step(`Filling input: ${selector} with: ${text}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      if (options?.clear) {
        await this.page.fill(selector, '');
      }
      await this.page.fill(selector, text);
    } else {
      await this.waitUtils.waitForVisible(selector);
      if (options?.clear) {
        await selector.fill('');
      }
      await selector.fill(text);
    }
  }

  /**
   * Type text with delay
   */
  async type(selector: string | Locator, text: string, delay?: number): Promise<void> {
    logger.step(`Typing in element: ${selector} with: ${text}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      await this.page.type(selector, text, { delay });
    } else {
      await this.waitUtils.waitForVisible(selector);
      await selector.type(text, { delay });
    }
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string | Locator, option: string | { value?: string; label?: string; index?: number }): Promise<void> {
    logger.step(`Selecting option in dropdown: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      if (typeof option === 'string') {
        await this.page.selectOption(selector, option);
      } else {
        await this.page.selectOption(selector, option);
      }
    } else {
      await this.waitUtils.waitForVisible(selector);
      if (typeof option === 'string') {
        await selector.selectOption(option);
      } else {
        await selector.selectOption(option);
      }
    }
  }

  /**
   * Get element text
   */
  async getText(selector: string | Locator): Promise<string> {
    logger.step(`Getting text from element: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      const text = await this.page.textContent(selector);
      return text || '';
    } else {
      await this.waitUtils.waitForVisible(selector);
      const text = await selector.textContent();
      return text || '';
    }
  }

  /**
   * Get element attribute
   */
  async getAttribute(selector: string | Locator, attribute: string): Promise<string | null> {
    logger.step(`Getting attribute '${attribute}' from element: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      return await this.page.getAttribute(selector, attribute);
    } else {
      await this.waitUtils.waitForVisible(selector);
      return await selector.getAttribute(attribute);
    }
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string | Locator): Promise<boolean> {
    try {
      if (typeof selector === 'string') {
        return await this.page.isVisible(selector);
      } else {
        return await selector.isVisible();
      }
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(selector: string | Locator): Promise<boolean> {
    try {
      if (typeof selector === 'string') {
        return await this.page.isEnabled(selector);
      } else {
        return await selector.isEnabled();
      }
    } catch {
      return false;
    }
  }

  /**
   * Check if element is checked (for checkboxes/radio buttons)
   */
  async isChecked(selector: string | Locator): Promise<boolean> {
    try {
      if (typeof selector === 'string') {
        return await this.page.isChecked(selector);
      } else {
        return await selector.isChecked();
      }
    } catch {
      return false;
    }
  }

  /**
   * Hover over element
   */
  async hover(selector: string | Locator): Promise<void> {
    logger.step(`Hovering over element: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.waitUtils.waitForVisible(selector);
      await this.page.hover(selector);
    } else {
      await this.waitUtils.waitForVisible(selector);
      await selector.hover();
    }
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string | Locator): Promise<void> {
    logger.step(`Scrolling element into view: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
    } else {
      await selector.scrollIntoViewIfNeeded();
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string | Locator, timeout?: number): Promise<void> {
    await this.waitUtils.waitForVisible(selector, timeout);
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    logger.step(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string | Locator, filePaths: string[]): Promise<void> {
    logger.step(`Uploading files: ${filePaths.join(', ')}`);
    
    if (typeof selector === 'string') {
      await this.page.setInputFiles(selector, filePaths);
    } else {
      await selector.setInputFiles(filePaths);
    }
  }

  /**
   * Get all matching elements
   */
  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Verify element is visible
   */
  async verifyElementVisible(selector: string | Locator, timeout?: number): Promise<void> {
    logger.step(`Verifying element is visible: ${selector}`);
    
    if (typeof selector === 'string') {
      await expect(this.page.locator(selector)).toBeVisible({ timeout });
    } else {
      await expect(selector).toBeVisible({ timeout });
    }
  }

  /**
   * Verify element contains text
   */
  async verifyElementContainsText(selector: string | Locator, expectedText: string): Promise<void> {
    logger.step(`Verifying element contains text: ${expectedText}`);
    
    if (typeof selector === 'string') {
      await expect(this.page.locator(selector)).toContainText(expectedText);
    } else {
      await expect(selector).toContainText(expectedText);
    }
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    logger.step(`Verifying page title: ${expectedTitle}`);
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify current URL
   */
  async verifyCurrentUrl(expectedUrl: string | RegExp): Promise<void> {
    logger.step(`Verifying current URL: ${expectedUrl}`);
    await expect(this.page).toHaveURL(expectedUrl);
  }
}