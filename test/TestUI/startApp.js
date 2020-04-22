//Создание страницы и переход в базовому Url
/**
 * Функция открытия новой страницы и перехода к стартовой странице
 */
async function createPageAndGotoBaseUrl () {

    const baseSettings = require('../../testData/baseSettings');
    let page = await browser.newPage();
    await page.goto(baseSettings.startUrl, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: baseSettings.width, height: baseSettings.height });
    return page;
};

module.exports.createPageAndGotoBaseUrl = createPageAndGotoBaseUrl