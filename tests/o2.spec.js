import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.o2.co.uk/');
  await page.getByRole('button', { name: 'Accept all cookies' }).click();
  await page.hover("//span[text()='Shop']"); 
  await page.getByRole('banner').getByRole('link', { name: 'Phones', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search phones' }).click();
  await page.getByRole('textbox', { name: 'Search phones' }).fill('samsung s24 Ultra');
  await page.locator('a').filter({ hasText: 'Samsung Galaxy S24 Ultra 5G' }).click();
  await page.getByText('Customise your plan').click();
  await page.locator('button').filter({ hasText: 'pay for your device in full' }).click();
  await page.getByRole('button', { name: 'Select this plan' }).click();
  await page.locator('#mat-radio-35 > .mat-radio > .radio-button_flex > .mat-radio-label > .mat-radio-container > .radio-button-outer-circle').click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: ' Go to Ultimate Insurance' }).click();
  await page.locator('#mat-radio-35 > .mat-radio > .radio-button_flex > .mat-radio-label > .mat-radio-container > .radio-button-inner-circle').click();
  await page.locator('#mat-radio-34 > .mat-radio > .radio-button_flex > .mat-radio-label > .mat-radio-container > .radio-button-outer-circle').click();
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await page.getByText('Upfront', { exact: true }).click();
});