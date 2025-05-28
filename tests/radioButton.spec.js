import {test,expect} from "@playwright/test";

test("Testing radio buttons", async({page}) => {

    await page.goto("https://www.facebook.com/");
    await page.getByText("Create new account").click();
    const maleRadio = await page.getByText("Male", {exact: true});
     const femaleRadio = await page.getByText("Female", {exact: true});
    await maleRadio.check();
    await expect(maleRadio).toBeChecked();
    await expect(await (maleRadio).isChecked()).toBeTruthy(); // Return true
    await expect(femaleRadio).not.toBeChecked();
    await expect(await (maleRadio).isChecked()).toBeFalsy(); // Returns false
    await page.waitForTimeout(2000);

})