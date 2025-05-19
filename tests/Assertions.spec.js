import {test, expect} from "@playwright/test";

test("Assertions", async({page})=>{
    await page.goto("https://demo.nopcommerce.com/register");

    // To have URL expect(page).toHaveURL()
    await expect(page).toHaveURL("https://demo.nopcommerce.com/register");

    //To have expected title: expect(page).toHaveTitle()
    await expect(page).toHaveTitle('nopCommerce demo store. Register')

    //To check if element is visible or not
    await expect(page.locator("//img[@alt='nopCommerce demo store']")).toBeVisible();

    //To check if checkbox or textbox or anything input para is enabled or not
    await expect(page.locator("//input[@id='small-searchterms']")).toBeEnabled();

    //Similarly if they're disabled or not with expect(page.locator('').toBeDisabled());

    //To check if radio or checkbox is checked or not
    await page.locator("#gender-male").check();
    await page.waitForTimeout(2000);
    await expect(page.locator("#gender-male")).toBeChecked();

    // To check if an element has particular attribute or not
    const fName = await page.locator("//input[@id='FirstName']");
    await expect(fName).toHaveAttribute("name","FirstName");

    // To check if particular element has text and partial text 
    const ele = await page.locator("//div[@class='page-title']/h1");
    await expect(ele).toHaveText("Register");
    await expect(ele).toContainText("Reg");

    // To check if particular element has a value or not
    const inputBox = await page.locator("#FirstName");
    inputBox.fill("Test");
    await expect(inputBox).toHaveValue("Test");

    //To check if list of elements has given length
    const urls = await page.locator("//a");
    await expect(urls).toHaveCount(62);
})


// for negative matches use expect(page).not.toBeChecked(); likewise for all others

/* Diff b/w soft assert and hard assert */

/*
    Hard assert terminates the test if assertion goes false 
    [Example of hard assert: await expect(page.locator('')).toBeVisible();]
*/

/* 
    Soft assert never terminates even though if assertion goes false
    [Example of soft assert: await expect.soft(page.locator('')).toBeVisible();] 
*/