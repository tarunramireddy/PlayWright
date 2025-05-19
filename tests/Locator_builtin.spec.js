import {test, expect} from "@playwright/test";

test('Locator_builtin', async({page})=>{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    //alt text - mostly used to locate image elements using alt text attribute
    await page.getByAltText("company-branding").isVisible();

    //using placeholder attribute to locate any element mostly input elements
    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("admin123");
    await page.waitForTimeout(2000);

    //using getByRole using explict and implict accessibility attributes
    await page.getByRole("button",{type:"Submit"}).click();   
    await page.waitForTimeout(2000);

    //Using getByText to get the text of the element
    const text = await page.locator(".oxd-userdropdown-name").textContent();
    await expect(page.getByText(text)).toBeVisible();


    //Use getByTitle() if any element has title attribute
    //Use getByTestId() if any element has data-testid attribute
    //Use getByLabel() if any element has label tag along with input textbox or checkbox or anything
})