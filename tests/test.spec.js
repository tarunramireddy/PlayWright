import {test,expect} from "@playwright/test";

test("test1", async({page}) => {
    await page.goto("https://www.google.com");
    await page.waitForTimeout(2000);
})

test("test2", async({page}) => {
    await page.goto("https://www.facebook.com");
    await page.waitForTimeout(2000);
}) 