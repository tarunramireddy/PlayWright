import {test,expect} from "@playwright/test";

test("checkbox test", async({page})=>{
    await page.goto("https://app.endtest.io/guides/docs/how-to-test-checkboxes/");
    const checkbox1 = await page.locator("//input[@id='pet1']");
    const checkbox2 = await page.locator("//input[@id='pet2']");
    const checkbox3 = await page.locator("//input[@id='pet3']");

    await checkbox2.uncheck();
    await page.waitForTimeout(2000);
    await expect(checkbox2).not.toBeChecked();
    await expect(await (checkbox2).isChecked()).toBeFalsy();

    //Multiple Checkboxes
    const multipleBoxesLoc = [checkbox1,checkbox2,checkbox3];

    for(const chck of multipleBoxesLoc){
        await chck.check();
    }
    await page.waitForTimeout(2000);
    for(const unchck of multipleBoxesLoc){
        if(await unchck.isChecked()){
            await unchck.uncheck();
        }
        else{
            console.log("Else block")
        }
    }
    await page.waitForTimeout(2000);

})