import { Page, Locator } from '@playwright/test';

/**
 * Simple locator helper functions
 * Use these to create any type of locator easily
 */

// CSS selector
export const css = (page: Page, selector: string): Locator => page.locator(selector);

// XPath
export const xpath = (page: Page, xpath: string): Locator => page.locator(`xpath=${xpath}`);

// Text content
export const text = (page: Page, text: string): Locator => page.locator(`text=${text}`);

// Data-testid
export const testId = (page: Page, testId: string): Locator => page.getByTestId(testId);

// Role (accessibility)
export const role = (page: Page, role: string, name?: string): Locator => 
  name ? page.getByRole(role as any, { name }) : page.getByRole(role as any);

// Placeholder
export const placeholder = (page: Page, placeholder: string): Locator => page.getByPlaceholder(placeholder);

// Label
export const label = (page: Page, label: string): Locator => page.getByLabel(label);