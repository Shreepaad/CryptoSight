const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());

const {executablePath} = require('puppeteer')

async function scrapeProduct() {
    const browser = await puppeteer.launch({ headless : false });
    const page = await browser.newPage();


    await page.goto('https://www.quantconnect.com/')
    await page.click('#qc-navbar-collapse > ul > li.top.dropdown > a');
    await page.waitForTimeout(2000);  
    await page.click('#social-media-links > a:nth-child(1) > button');
    await page.waitForTimeout(2000);
    await page.type('#identifierId', 'throweway15@gmail.com');
    await page.waitForTimeout(2000);

    await page.click('#identifierNext > div > button > div.VfPpkd-RLmnJb');
    await page.waitForTimeout(2000);
    // // #identifierId
    // #password > div.aCsJod.oJeWuf > div > div.Xb9hP > input
    await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', 'hurshV1507'); 
    await page.waitForTimeout(3000);
    // await page.click('#loginForm > div:nth-child(9) > button');
    await page.click('#passwordNext > div > button > div.VfPpkd-RLmnJb');
    await page.waitForTimeout(3000);  

    await page.goto('https://www.quantconnect.com/project/15382513/');

    await page.waitForTimeout(10000);





    for(let i = 0; i < 18; i++) {
        await page.keyboard.press('ArrowDown');
    }
    await page.waitForTimeout(1000);
    for(let i = 0; i < 70; i++) {
        await page.keyboard.press('ArrowRight');
    }
    for(let i = 0; i < 65; i++) {
        await page.keyboard.press('Backspace');
    }
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    let str = 'self.symbol = self.AddCrypto("BTCUSD", Resolution.Hour).Symbol';
    for(let i = 0; i < str.length; i++) {
        await page.keyboard.press(str.charAt(i));
    }
    await page.waitForTimeout(4000);
    // await page.click('#workbench\.parts\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons > div.tabs-and-actions-container > div.monaco-scrollable-element.mac > div.tabs-container');
    // await page.click('#workbench\.parts\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons > div.tabs-and-actions-container > div.editor-actions > div > div > ul > li:nth-child(2) > a');

    // await page.click("#workbench\.parts\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons > div.tabs-and-actions-container > div.editor-actions > div > div > ul > li:nth-child(2) > a");
    await page.keyboard.press("Control", "s") 
    await page.waitForTimeout(1000);
    await page.keyboard.press('Control', "F5")
};
scrapeProduct();