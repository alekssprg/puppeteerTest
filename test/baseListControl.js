const assert = require('chai').assert;
//ожидаем загрузку данных в грид, пока не появятся строчки
async function gridPanelDataExists(page, controlType, gridPanelId) {
    await page.waitForFunction('window.SpargoJs.Test.gridPanelDataExists("' + controlType + '","' + gridPanelId + '")');
};

//ожидаем завершения Ajax запроса
async function waitAjaxRequestComplete(page) {
    const finalResponse = await page.waitForResponse(response => response.status() === 200);
    assert(finalResponse.ok(),"AJAX запрос вернулся с ошибкой.");
};

//Открытие журнала документов
async function selectGridPanelElement (page, controlType, gridPanelId, rowNumber) {
    await gridPanelDataExists(page, controlType, gridPanelId);
    await page.evaluate((controlType,gridPanelId, rowNumber) => {
        if (!window.SpargoJs.Test.selectGridPanelElementComplete(controlType, gridPanelId, rowNumber)) {
            window.SpargoJs.Test.selectGridPanelElement(controlType, gridPanelId, rowNumber);
        }
    }, controlType, gridPanelId, rowNumber);
    const watchControlLoad = page.waitForFunction('window.SpargoJs.Test.selectGridPanelElementComplete("' + controlType + '","' + gridPanelId + '",' + rowNumber +')');
    await watchControlLoad;
};

//ищем кнопку тулбара или формы
async function getToolbarButton (page, controlType, buttonId, toolbarId) {
    var button = await page.evaluateHandle((controlType, buttonId, toolbarId) => {
        debugger;
        return window.SpargoJs.Test.getButtonDom(controlType, buttonId, toolbarId);
    }, controlType, buttonId, toolbarId);
    return button.asElement();
};

//нажатие кнопки
async function buttonClick (button) {
    await button.click();
};

//ожидание по условию
async function waitByCondition(page, condition){
    const watchControlLoad = page.waitForFunction(condition);
    await watchControlLoad;
};

module.exports.gridPanelDataExists = gridPanelDataExists
module.exports.selectGridPanelElement = selectGridPanelElement
module.exports.getToolbarButton = getToolbarButton
module.exports.buttonClick = buttonClick
module.exports.waitByCondition = waitByCondition
module.exports.waitAjaxRequestComplete = waitAjaxRequestComplete