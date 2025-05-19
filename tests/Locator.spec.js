import {test,expect} from '@playwright/test';
//const { test, expect } = require('@playwright/test');

test('locators', async({page})=>{
   await page.goto("https://demoblaze.com/index.html");

   //using xpath locator:
//    await page.locator("//a[@id='login2']").click();
   await page.click("//a[@id='login2']");

    // Enter text into textbox just like sendkeys
    // await page.fill("//input[@id='loginusername']","test");
   await page.locator("//input[@id='loginusername']").fill("test");
   await page.waitForTimeout(2000);

   //using css selector
   await page.locator("#loginpassword").type("test");
   await page.waitForTimeout(2000);

   await page.click("//button[@onclick='logIn()']");
   await page.waitForTimeout(2000);
   await expect(page.locator("#logout2")).toBeVisible();

   // For locating multiple elements
   // if sometimes page is not loaded properly we can use this first (page.waitForSelector("//a[@class='hrefch']");)
   const multiplePhoneLinks = await page.$$("//a[@class='hrefch']");
   for(const phone of multiplePhoneLinks){
    const Phone = await phone.textContent();
    console.log(Phone);
   }
})