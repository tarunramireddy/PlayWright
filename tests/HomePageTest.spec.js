const {test, expect} = require('@playwright/test')

test("home page test", async({page}) => {
    await page.goto('https://www.demoblaze.com/index.html');
    let title = await page.title();
    console.log(title);
    await expect(page).toHaveTitle('STORE');
    await expect(page).toHaveURL('https://www.demoblaze.com/index.html');
    await page.click("//a[@id='login2']");
    await page.fill("//input[@id='loginusername']","test");
    await page.fill("//input[@id='loginpassword']","test");
    await page.click("//button[@onclick='logIn()']");
    await expect(page.locator("//a[@id='nameofuser']")).toHaveText("Welcome test");
    await page.close();
})
