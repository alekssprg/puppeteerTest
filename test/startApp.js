const baseSettingsPath = '../testData/baseSettings.json'

//Создание страницы и переход в базовому Url
module.exports.createPageAndGotoBaseUrl = async function () {
    let baseSettings = require(baseSettingsPath);
    let page = await browser.newPage();
    await page.goto(baseSettings.startUrl, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: baseSettings.width, height: baseSettings.height });
    return page;
};