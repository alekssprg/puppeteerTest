const assert = require('chai').assert;
const { createWaitConditionByControlType, WINDOW_SPARGO_JS_TEST } = require('./controlHelper.js');

//ожидаем загрузку данных в грид, пока не появятся строчки
async function gridPanelDataExists(page, controlType, gridPanelId) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'gridPanelDataExists("' + controlType + '","' + gridPanelId + '")');
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
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'selectGridPanelElementComplete("' + controlType + '","' + gridPanelId + '",' + rowNumber + ')');
};

//ищем кнопку тулбара или формы
async function clickToolbarButton (page, controlType, buttonId, toolbarId) {
    let button = await getToolbarButton(page, controlType, buttonId, toolbarId);
    await buttonClick(button);
};

//ищем кнопку тулбара или формы
async function getToolbarButton (page, controlType, buttonId, toolbarId) {
    let button = await page.evaluateHandle((controlType, buttonId, toolbarId) => {
        return window.SpargoJs.Test.getButtonDom(controlType, buttonId, toolbarId);
    }, controlType, buttonId, toolbarId);
    return button.asElement();
};

//ожидаем закрытия окна формы редактирования
async function waitWindowClose(page, controlType, windowId) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + "checkWindowClose('" + controlType + "','" + windowId + "') == true");
};

//ожидаем закрытия окна формы редактирования
async function waitWindowActive(page, controlType, windowId) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + "checkWindowActive('" + controlType + "','" + windowId + "') == true");
};

//нажатие кнопки
async function buttonClick (button) {
    await button.click();
};

//ожидаем загрузки контрола указанного типа
async function waitByControlTypeLoad(page, waitControlType) {
    await waitByCondition(page, createWaitConditionByControlType(waitControlType));
};

//ожидание по условию
async function waitByCondition(page, condition){
    await page.waitForFunction(condition);
};

function controlToolbarId(controlId, toolbarId) {
    if ((toolbarId) && (toolbarId != '')) controlId = toolbarId + controlId;
    return controlId;
}

module.exports.gridPanelDataExists = gridPanelDataExists
module.exports.selectGridPanelElement = selectGridPanelElement
module.exports.getToolbarButton = getToolbarButton
module.exports.clickToolbarButton = clickToolbarButton
module.exports.buttonClick = buttonClick
module.exports.waitByCondition = waitByCondition
module.exports.waitByControlTypeLoad = waitByControlTypeLoad
module.exports.waitAjaxRequestComplete = waitAjaxRequestComplete
module.exports.controlToolbarId = controlToolbarId
module.exports.waitWindowClose = waitWindowClose
module.exports.waitWindowActive = waitWindowActive