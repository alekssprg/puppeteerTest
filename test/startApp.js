const baseSettingsPath = '../testData/baseSettings.json'

//Создание страницы и переход в базовому Url
module.exports.createPageAndGotoBaseUrl = async function (page) {
    var baseSettings = require(baseSettingsPath);
    page = await browser.newPage();
    /*page.deleteCookie({
        name : "ASP.NET_SessionId"
    });*/
    //await page.setCookie({});
    //let cook = await page.cookies()
    await page.goto(baseSettings.startUrl, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: baseSettings.width, height: baseSettings.height });
    return page;
};