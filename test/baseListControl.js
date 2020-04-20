const assert = require('chai').assert;
const { createWaitConditionByControlType, WINDOW_SPARGO_JS_TEST } = require('./controlHelper.js');

/**
 * Ожидаем загрузку данных в грид, пока не появятся строчки 
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} gridPanelId ID грида 
 */
async function gridPanelDataExists(page, controlType, gridPanelId) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'gridPanelDataExists("' + controlType + '","' + gridPanelId + '")');
};

/**
 * Ожидаем завершения Ajax запроса
 * @param {object} page страница браузера
 */
async function waitAjaxRequestComplete(page) {
    const finalResponse = await page.waitForResponse(response => response.status() === 200);
    assert(finalResponse.ok(),"AJAX запрос вернулся с ошибкой.");
};

/**
 * Выбор элемента указанного грида по индексу и ожидание его выбора 
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} gridPanelId ID грида 
 * @param {string} rowNumber номер строки (начинается с 1)
 */
async function selectGridPanelElement (page, controlType, gridPanelId, rowNumber) {
    await gridPanelDataExists(page, controlType, gridPanelId);
    await page.evaluate((controlType,gridPanelId, rowNumber) => {
        if (!window.SpargoJs.Test.selectGridPanelElementComplete(controlType, gridPanelId, rowNumber)) {
            window.SpargoJs.Test.selectGridPanelElement(controlType, gridPanelId, rowNumber);
        }
    }, controlType, gridPanelId, rowNumber);
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'selectGridPanelElementComplete("' + controlType + '","' + gridPanelId + '",' + rowNumber + ')');
};

/**
 * Ищем кнопку тулбара или формы и нажимаем на неё
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} buttonId ID кнопки с учетом ID тулбара
 */
async function clickToolbarButton (page, controlType, buttonId) {
    let button = await getToolbarButton(page, controlType, buttonId);
    await buttonClick(button);
};

/**
 * Ищем кнопку тулбара или формы
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} buttonId ID кнопки с учетом ID тулбара
 */
async function getToolbarButton (page, controlType, buttonId) {
    let button = await page.evaluateHandle((controlType, buttonId) => {
        return window.SpargoJs.Test.getButtonDom(controlType, buttonId);
    }, controlType, buttonId);
    return button.asElement();
};

/**
 * Ожидаем закрытия окна формы редактирования
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} windowId ID окна, которое должны быть закрыто
 */
async function waitWindowClose(page, controlType, windowId) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + "checkWindowClose('" + controlType + "','" + windowId + "') == true");
};

/**
 * Ожидаем, что указанное окно станет активным
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} windowId ID окна, которое должны быть закрыто
 */
async function waitWindowActive(page, controlType, windowId) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + "checkWindowActive('" + controlType + "','" + windowId + "') == true");
};

/**
 * Нажатие кнопки
 * @param {object} button объект кнопки
 */
async function buttonClick (button) {
    await button.click();
};

/**
 * Ожидаем загрузки контрола указанного типа
 * @param {object} page страница браузера
 * @param {string} waitControlType тип контрола, который должен быть загружен
 */
async function waitByControlTypeLoad(page, waitControlType) {
    await waitByCondition(page, createWaitConditionByControlType(waitControlType));
};

/**
 * Функция ожидания по условию
 * @param {object} page страница браузера
 * @param {string} condition JS функция условие
 */
async function waitByCondition(page, condition){
    await page.waitForFunction(condition);
};

/**
 * Функия формирования ID контрола на тулбаре
 * @param {string} controlId ID контрола
 * @param {string} toolbarId ID тулбара
 */
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