import {test,expect} from "@playwright/test";

test("Handling Input Boxes", async({page})=>{
    await page.goto("https://www.facebook.com/");
    await page.getByText("Create new account").click();
    await page.waitForTimeout(2000);

    const first_name = await page.getByLabel("First name");
    await expect(first_name).toBeVisible();
    await expect(first_name).toBeEnabled();
    await expect(first_name).toBeEmpty();
    await expect(first_name).toBeEditable();

    const last_name = await page.getByLabel("Last name");
    await expect(last_name).toBeVisible();
    await expect(last_name).toBeEnabled();
    await expect(last_name).toBeEmpty();
    await expect(last_name).toBeEditable();

    await first_name.fill("Playwright");
    await last_name.fill("JavaScript");
    await page.waitForTimeout(2000);

})