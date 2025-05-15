import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

    await page.goto('https://www.google.com/');
    const Element = await page.$$("//a"); 
    for(const Ele of Element){
        const EleText = await Ele.textContent();
        console.log(EleText);
    }

})