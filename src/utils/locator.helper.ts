import { Page, Locator } from '@playwright/test';

export const css = (page: Page, selector: string): Locator => page.locator(selector);

export const xpath = (page: Page, xpath: string): Locator => page.locator(`xpath=${xpath}`);

export const text = (page: Page, text: string): Locator => page.locator(`text=${text}`);

export const testId = (page: Page, testId: string): Locator => page.getByTestId(testId);

export const role = (page: Page, role: string, name?: string): Locator => 
  name ? page.getByRole(role as any, { name }) : page.getByRole(role as any);

export const placeholder = (page: Page, placeholder: string): Locator => page.getByPlaceholder(placeholder);

export const label = (page: Page, label: string): Locator => page.getByLabel(label);