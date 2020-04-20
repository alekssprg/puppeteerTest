'use strict'
const { selectGridPanelElement, waitByControlTypeLoad, waitWindowClose } = require('./baseListControl.js');
const { WINDOW_SPARGO_JS_TEST } = require('./controlHelper.js');
/**
 * @enum {string} типы полей
 */
const FIELD_TYPE = { TEXT : "text", SELECT : "select", DATE : "date", BOOLEAN : "boolean",
NUMBER : "number", EXTENDSSTATUSCOMBOBOX: "extendsstatuscombobox" };
/**
 * @enum {string} коды кнопок
 */
const MB_BUTTON_CODE = {OK: "ok", YES: "yes", NO: "no", CANCEL: "cancel"};
/**
 * Класс для описания полей формы
 */
class FormField {
    /**
     * Конструктор класса
     * @param {string} name имя или метка поля
     * @param {string} value значение, которое нужно задать
     * @param {FIELD_TYPE} type тип контрола
     * @param {string} selectControlType тип контрола для загрузки, если это поле с выбором
     * @param {string} selectGridPanelId ID грида с данными, из которого нужно выбирать
     * @param {string} selectWindowId ID окна, которое будет открыто
     * @param {string} doubleClickHandler обработчик двойного нажатия на строке грида
     */
    constructor (name, value, type, selectControlType, selectGridPanelId, selectWindowId, doubleClickHandler){
       //поля будут публичные
       this.name = name;
       this.value = value;
       this.type = type;
       this.selectControlType = selectControlType;
       this.selectGridPanelId = selectGridPanelId;
       this.selectWindowId = selectWindowId;
       this.doubleClickHandler = doubleClickHandler;
    }
}
/**
 * Ожидаем заполнения поля валидным (не пустым) значением
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола
 * @param {string} formId ID контрола формы
 * @param {string} fieldName имя или метка поля
 */
async function checkFieldValueValid (page, controlType, formId, fieldName) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'formFieldValueValid("' + controlType + '","' + formId + '","' + fieldName + '")');
};

/**
 * Функция заполнения полей формы редактирования 
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {FormField[]} fieldArray массив полей формы
 */
async function fillProgramEditForm(page, controlType, formId, fieldArray) {
    for(let i = 0; i < fieldArray.length; i++){
        let field = fieldArray[i];
        if ((field.type == FIELD_TYPE.TEXT)||(field.type == FIELD_TYPE.DATE)||(field.type == FIELD_TYPE.NUMBER)) {
            //сделать цикл по полям
            await fillTextField(page, controlType, formId, field);
        } else if (field.type == FIELD_TYPE.SELECT) {
            await fillTriggerField(page, controlType, formId, field);
        } else if (field.type == FIELD_TYPE.BOOLEAN) {
            await fillBooleanField(page, controlType, formId, field);
        } else if (field.type == FIELD_TYPE.EXTENDSSTATUSCOMBOBOX) {
            await fillComboBoxField(page, controlType, formId, field);
        }
    }
};

/**
 * Заполнение текстового поля
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {FormField} field поле формы
 */
async function fillTextField(page, controlType, formId, field) {
    let fieldElement = await getElementByName(page, controlType, formId, field.name);
    await textFieldClearValueIfNotEmpty(page, controlType, formId, field.name);
    await fieldElement.type(field.value);
    await checkFieldValueValid(page, controlType, formId, field.name);
};

/**
 * Функция получения элемента формы по ID формы и имени поля 
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {string} fieldName имя поля
 */
async function getElementByName(page, controlType, formId, fieldName) {
    let field = await page.evaluateHandle((controlType, formId, fieldName) => {
        return window.SpargoJs.Test.getFormFieldDom(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
    return field.asElement();
};

/**
 * Функция очистки текстового поля, если оно не пустое
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {string} fieldName имя поля 
 */
async function textFieldClearValueIfNotEmpty(page, controlType, formId, fieldName) {
    await page.evaluateHandle((controlType, formId, fieldName) => {
        return window.SpargoJs.Test.formTextFieldClearValueIfNotEmpty(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
};

/**
 * Заполнение поля с триггером
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {FormField} field имя поля
 */
async function fillTriggerField(page, controlType, formId, field) {
    let triggerButtonClear = await getTriggerFieldButton(page, controlType, formId, field.name, 1);
    await triggerButtonClear.click();
    let triggerButtonOpen = await getTriggerFieldButton(page, controlType, formId, field.name, 0);
    await triggerButtonOpen.click({clickCount:2});
    await waitByControlTypeLoad(page, field.selectControlType);
    await selectGridPanelElement(page, field.selectControlType, field.selectGridPanelId, 1);
    await gridPanelDoubleClickCall(page, field.selectControlType, field.selectGridPanelId, field.doubleClickHandler);
    await waitWindowClose(page, field.selectControlType, field.selectWindowId);
    await checkFieldValueValid(page, controlType, formId, field.name);
};

/**
 * Функция получения кнопки TriggerField-а (по умолчанию юерем первую кнопку - открыть справочник) 
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {string} triggerFieldName имя поля
 * @param {int} buttonIndex индекс кнопки триггера (нумерация с 0)
 */
async function getTriggerFieldButton(page, controlType, formId, triggerFieldName, buttonIndex = 0) {
    let field = await page.evaluateHandle((controlType, formId, fieldName, buttonIndex) => {
        return window.SpargoJs.Test.getFormTriggerFieldButtonDom(controlType, formId, fieldName, buttonIndex);
    }, controlType, formId, triggerFieldName, buttonIndex);
    return field.asElement();
};

/**
 * Вызов обработчика двойного щелчка у грида
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы с выбором элемента справочника
 * @param {string} gridPanelId ID грида
 * @param {string} doubleClickHandler обработчик двойного щелчка
 */
async function gridPanelDoubleClickCall (page, controlType, gridPanelId, doubleClickHandler) {
    await page.evaluate((controlType, gridPanelId, doubleClickHandler) => {
        var gridPanel = window.SpargoJs.Test.getGridPanel(controlType, gridPanelId);
        var fn = eval(doubleClickHandler);
        fn(gridPanel);
    }, controlType, gridPanelId, doubleClickHandler);
};

/**
 * Заполнение поля комбобокса
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {FormField} field поле формы
 */
async function fillComboBoxField(page, controlType, formId, field) {
    await textFieldClearValueIfNotEmpty(page, controlType, formId, field.name);
    let fieldElement = await getElementByName(page, controlType, formId, field.name);
    await fieldElement.click();
    await formComboBoxBoundListIsOpen(page, controlType, formId, field.name);
    let listItem = await getComboBoxBoundListItem(page, controlType, formId, field);
    await listItem.click();
    await checkFieldValueValid(page, controlType, formId, field.name);
};

/**
 * Ждем открытия списка для комбобокса
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {string} fieldName имя поля
 */
async function formComboBoxBoundListIsOpen (page, controlType, formId, fieldName) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'formComboBoxBoundListIsOpen("' + controlType + '","' + formId + '","' + fieldName + '")');
};

/**
 * Функция получения элемента из выпадающего списка ComboBox-а
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {FormField} field поле формы
 */
async function getComboBoxBoundListItem(page, controlType, formId, field) {
    let listItem = await page.evaluateHandle((controlType, formId, fieldName, textValue) => {
        return window.SpargoJs.Test.getComboBoxBoundListItem(controlType, formId, fieldName, textValue);
    }, controlType, formId, field.name, field.value);
    return listItem.asElement();
};

/**
 * Функция заполнение поля флага
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {FormField} field поле формы
 */
async function fillBooleanField(page, controlType, formId, field) {
    let fieldElementValue = await getCheckBoxFieldValue(page, controlType, formId, field.name);
    if (field.value !== fieldElementValue) {
        let fieldElement = await getElementByName(page, controlType, formId, field.name);
        await fieldElement.click();
    }
    let fieldElementValueNew = await getCheckBoxFieldValue(page, controlType, formId, field.name);
    if (field.value !== fieldElementValueNew) {
        throw new Error("Не удалось задать значение combobox-а:" + controlType + " " + formId + " " + field.name);
    }
};

/**
 * Функция получения значения checkbox-а
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} formId ID формы
 * @param {string} fieldName имя поля
 */
async function getCheckBoxFieldValue(page, controlType, formId, fieldName) {
    return await page.evaluate((controlType, formId, fieldName) => {
        return window.SpargoJs.Test.getCheckBoxValue(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
};

//функция ожидания появления MessageBox-а
//Ждет появления messageBox-а
//Проверяем текст его сообщения
//Нажимает указанную кнопку
/**
 * Функция ожидания появления MessageBox-а. Ждет появления messageBox-а. Проверяем текст его сообщения. Нажимает указанную кнопку.
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} windowId ID текущего открытого окна
 * @param {string[]} waitMessageBoxText ожидаемые сообщения
 * @param {MB_BUTTON_CODE} messageBoxButtonCode код кнопки для закрытия MessageBox-а
 */
async function waitMessageBoxWithText(page, controlType, windowId, waitMessageBoxText, messageBoxButtonCode = MESSAGEBOX_BUTTON_CODE.OK) {
    await waitMessageBoxActive(page, controlType, windowId);
    let messageBoxInnerText = await page.evaluate((controlType, windowId) => {
        return window.SpargoJs.Test.getMessageBoxInnerText(controlType, windowId);
    }, controlType, windowId);
    checkMessgaeBoxInnerTextToIncludeNeedString(waitMessageBoxText, messageBoxInnerText);
    let button = await getMessageBoxButton(page, controlType, windowId, messageBoxButtonCode);
    await button.click();
};

/**
 * Функция получение кнопки MessageBox-а
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} windowId ID текущего открытого окна
 * @param {MB_BUTTON_CODE} messageBoxButtonCode код кнопки для закрытия MessageBox-а
 */
async function getMessageBoxButton(page, controlType, windowId, messageBoxButtonCode) {
    let button = await page.evaluateHandle((controlType, windowId, messageBoxButtonCode) => {
        return window.SpargoJs.Test.getMessageBoxButton(controlType, windowId, messageBoxButtonCode);
    }, controlType, windowId, messageBoxButtonCode);
    return button.asElement();
}

/**
 * Функция ожидаем появления MessageBox-а
 * @param {object} page страница браузера
 * @param {string} controlType тип контрола формы редактирования
 * @param {string} windowId ID текущего открытого окна
 */
async function waitMessageBoxActive(page, controlType, windowId){
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + "isActiveWindowIsMessageBox('" + controlType + "','" + windowId + "') == true");
};

//проверяем вхождение строк в сообщение MessageBox-а
/**
 * Функция проверки вхождения строк в сообщение MessageBox-а
 * @param {string[]} waitMessageBoxText ожидаемые сообщения
 * @param {string} messageBoxInnerText innertext MessageBox-а
 */
function checkMessgaeBoxInnerTextToIncludeNeedString(waitMessageBoxText, messageBoxInnerText) {
    let messageBoxInnerTextUC = messageBoxInnerText.toUpperCase();
    if (waitMessageBoxText instanceof String)
        waitMessageBoxText = [waitMessageBoxText];
    let find = true;
    if (waitMessageBoxText instanceof Array) {
        for (let i = 0; i < waitMessageBoxText.length; i++) {
            find = find && messageBoxInnerTextUC.includes(waitMessageBoxText[i].toUpperCase());
        }
    }
    if (!find) throw new Error("MessageBox не содержит нужного сообщения. Ожидаемое сообщение: " + waitMessageBoxText.join(' ') + " Полученное сообщение: " + messageBoxInnerText);
    return find;
};

module.exports.FIELD_TYPE = FIELD_TYPE
module.exports.MB_BUTTON_CODE = MB_BUTTON_CODE
module.exports.FormField = FormField
module.exports.fillProgramEditForm = fillProgramEditForm
module.exports.waitMessageBoxWithText = waitMessageBoxWithText