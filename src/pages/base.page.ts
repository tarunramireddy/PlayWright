import { Page, Locator, expect } from '@playwright/test';
import { WaitUtils, logger } from '../utils/index';
import { credentialsManager } from '../config/config.manager';

export abstract class BasePage {
  protected page: Page;
  protected waitUtils: WaitUtils;
  protected config = credentialsManager.getPlaywrightConfig();

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  abstract isLoaded(): Promise<boolean>;

  abstract getUrl(): string;

  async navigate(url?: string): Promise<void> {
    const targetUrl = url || this.getUrl();
    logger.step(`Navigating to: ${targetUrl}`);
    await this.page.goto(targetUrl);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    logger.step('Waiting for page to load');
    await this.waitUtils.waitForPageLoad();
  }

  async getTitle(): Promise<string> {
    logger.step('Getting page title');
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    logger.step('Getting current URL');
    return this.page.url();
  }

  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    logger.step(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ 
      fullPage: true,
      path: `test-results/screenshots/${screenshotName}.png`
    });
  }

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

  async scrollIntoView(selector: string | Locator): Promise<void> {
    logger.step(`Scrolling element into view: ${selector}`);
    
    if (typeof selector === 'string') {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
    } else {
      await selector.scrollIntoViewIfNeeded();
    }
  }

  async waitForElement(selector: string | Locator, timeout?: number): Promise<void> {
    await this.waitUtils.waitForVisible(selector, timeout);
  }

  async pressKey(key: string): Promise<void> {
    logger.step(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  async uploadFile(selector: string | Locator, filePaths: string[]): Promise<void> {
    logger.step(`Uploading files: ${filePaths.join(', ')}`);
    
    if (typeof selector === 'string') {
      await this.page.setInputFiles(selector, filePaths);
    } else {
      await selector.setInputFiles(filePaths);
    }
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async verifyElementVisible(selector: string | Locator, timeout?: number): Promise<void> {
    logger.step(`Verifying element is visible: ${selector}`);
    
    if (typeof selector === 'string') {
      await expect(this.page.locator(selector)).toBeVisible({ timeout });
    } else {
      await expect(selector).toBeVisible({ timeout });
    }
  }

  async verifyElementContainsText(selector: string | Locator, expectedText: string): Promise<void> {
    logger.step(`Verifying element contains text: ${expectedText}`);
    
    if (typeof selector === 'string') {
      await expect(this.page.locator(selector)).toContainText(expectedText);
    } else {
      await expect(selector).toContainText(expectedText);
    }
  }

  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    logger.step(`Verifying page title: ${expectedTitle}`);
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyCurrentUrl(expectedUrl: string | RegExp): Promise<void> {
    logger.step(`Verifying current URL: ${expectedUrl}`);
    await expect(this.page).toHaveURL(expectedUrl);
  }
}