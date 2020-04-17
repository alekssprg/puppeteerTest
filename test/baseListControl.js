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

//выбор элемента указанного грида по индексу и ожидание его выбора
async function selectGridPanelElement (page, controlType, gridPanelId, rowNumber) {
    await gridPanelDataExists(page, controlType, gridPanelId);
    await page.evaluate((controlType,gridPanelId, rowNumber) => {
        if (!window.SpargoJs.Test.selectGridPanelElementComplete(controlType, gridPanelId, rowNumber)) {
            window.SpargoJs.Test.selectGridPanelElement(controlType, gridPanelId, rowNumber);
        }
    }, controlType, gridPanelId, rowNumber);
    const watchControlLoad = page.waitForFunction('window.SpargoJs.Test.selectGridPanelElementComplete("' + controlType + '","' + gridPanelId + '",' + rowNumber + ')');
    await watchControlLoad;
};

//ищем кнопку тулбара или формы
async function getToolbarButton (page, controlType, buttonId, toolbarId) {
    let button = await page.evaluateHandle((controlType, buttonId, toolbarId) => {
        debugger;
        return window.SpargoJs.Test.getButtonDom(controlType, buttonId, toolbarId);
    }, controlType, buttonId, toolbarId);
    return button.asElement();
};

//ожидаем закрытия окна формы редактирования
async function waitWindowClose(page, controlType, windowId) {
    await page.waitForFunction("(window.SpargoJs.Test.checkWindowClose('" + controlType + "','" + windowId + "') == true)");
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

function controlToolbarId(controlId, toolbarId) {
    if ((toolbarId) && (toolbarId != '')) controlId = toolbarId + controlId;
    return controlId;
}

module.exports.gridPanelDataExists = gridPanelDataExists
module.exports.selectGridPanelElement = selectGridPanelElement
module.exports.getToolbarButton = getToolbarButton
module.exports.buttonClick = buttonClick
module.exports.waitByCondition = waitByCondition
module.exports.waitAjaxRequestComplete = waitAjaxRequestComplete
module.exports.controlToolbarId = controlToolbarId
module.exports.waitWindowClose = waitWindowClose