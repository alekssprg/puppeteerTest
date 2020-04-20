'use strict'
const { selectGridPanelElement, waitByControlTypeLoad, waitWindowClose } = require('./baseListControl.js');
const FIELD_TYPE = { TEXT : "text", SELECT : "select", DATE : "date", BOOLEAN : "boolean",
NUMBER : "number", EXTENDSSTATUSCOMBOBOX: "extendsstatuscombobox" };
const { WINDOW_SPARGO_JS_TEST } = require('./controlHelper.js');
const MB_BUTTON_CODE = {OK: "ok", YES: "yes", NO: "no", CANCEL: "cancel"};

class FormField {
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

//ожидание заполнения поля формы не пустым значением
async function checkFieldValueValid (page, controlType, formId, fieldName) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'formFieldValueValid("' + controlType + '","' + formId + '","' + fieldName + '")');
};

//заполнение полей формы редактирования
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

//заполнение текстового поля
async function fillTextField(page, controlType, formId, field) {
    let fieldElement = await getElementByName(page, controlType, formId, field.name);
    await textFieldClearValueIfNotEmpty(page, controlType, formId, field.name);
    await fieldElement.type(field.value);
    await checkFieldValueValid(page, controlType, formId, field.name);
};

//функция получения элемента формы по ID формы и имени поля
async function getElementByName(page, controlType, formId, fieldName) {
    let field = await page.evaluateHandle((controlType, formId, fieldName) => {
        return window.SpargoJs.Test.getFormFieldDom(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
    return field.asElement();
};

//функция очистки текстового поля, если оно не пустое
async function textFieldClearValueIfNotEmpty(page, controlType, formId, fieldName) {
    await page.evaluateHandle((controlType, formId, fieldName) => {
        return window.SpargoJs.Test.formTextFieldClearValueIfNotEmpty(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
};

//заполнение поля с триггером
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

//функция получения кнопки TriggerField-а (по умолчанию юерем первую кнопку - открыть справочник)
async function getTriggerFieldButton(page, controlType, formId, triggerFieldName, buttonIndex = 0) {
    let field = await page.evaluateHandle((controlType, formId, fieldName, buttonIndex) => {
        return window.SpargoJs.Test.getFormTriggerFieldButtonDom(controlType, formId, fieldName, buttonIndex);
    }, controlType, formId, triggerFieldName, buttonIndex);
    return field.asElement();
};

//вызов обработчика двойного щелчка у грида
async function gridPanelDoubleClickCall (page, controlType, gridPanelId, doubleClickHandler) {
    await page.evaluate((controlType, gridPanelId, doubleClickHandler) => {
        var gridPanel = window.SpargoJs.Test.getGridPanel(controlType, gridPanelId);
        var fn = eval(doubleClickHandler);
        fn(gridPanel);
    }, controlType, gridPanelId, doubleClickHandler);
};

//заполнение поля комбобокса
async function fillComboBoxField(page, controlType, formId, field) {
    await textFieldClearValueIfNotEmpty(page, controlType, formId, field.name);
    let fieldElement = await getElementByName(page, controlType, formId, field.name);
    await fieldElement.click();
    await formComboBoxBoundListIsOpen(page, controlType, formId, field.name);
    let listItem = await getComboBoxBoundListItem(page, controlType, formId, field);
    await listItem.click();
    await checkFieldValueValid(page, controlType, formId, field.name);
};

//ждем открытия списка для комбобокса
async function formComboBoxBoundListIsOpen (page, controlType, formId, fieldName) {
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + 'formComboBoxBoundListIsOpen("' + controlType + '","' + formId + '","' + fieldName + '")');
};

//функция получения элемента из выпадющего списка ComboBox-а
async function getComboBoxBoundListItem(page, controlType, formId, field) {
    let listItem = await page.evaluateHandle((controlType, formId, fieldName, textValue) => {
        return window.SpargoJs.Test.getComboBoxBoundListItem(controlType, formId, fieldName, textValue);
    }, controlType, formId, field.name, field.value);
    return listItem.asElement();
};

//заполнение поля флага
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

//функция получения значения checkbox-а
async function getCheckBoxFieldValue(page, controlType, formId, fieldName) {
    return await page.evaluate((controlType, formId, fieldName) => {
        return window.SpargoJs.Test.getCheckBoxValue(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
};

//функция ожидания появления MessageBox-а
//Ждет появления messageBox-а
//Проверяем текст его сообщения
//Нажимает указанную кнопку
async function waitMessageBoxWithText(page, controlType, windowId, waitMessageBoxText, messageBoxButtonCode = MESSAGEBOX_BUTTON_CODE.OK) {
    await waitMessageBoxActive(page, controlType, windowId);
    let messageBoxInnerText = await page.evaluate((controlType, windowId) => {
        return window.SpargoJs.Test.getMessageBoxInnerText(controlType, windowId);
    }, controlType, windowId);
    checkMessgaeBoxInnerTextToIncludeNeedString(waitMessageBoxText, messageBoxInnerText);
    let button = await getMessageBoxButton(page, controlType, windowId, messageBoxButtonCode);
    await button.click();
};

//получение кнопки MessageBox-а
async function getMessageBoxButton(page, controlType, windowId, messageBoxButtonCode) {
    let button = await page.evaluateHandle((controlType, windowId, messageBoxButtonCode) => {
        return window.SpargoJs.Test.getMessageBoxButton(controlType, windowId, messageBoxButtonCode);
    }, controlType, windowId, messageBoxButtonCode);
    return button.asElement();
}

//ожидаем появления MessageBox-а
async function waitMessageBoxActive(page, controlType, windowId){
    await page.waitForFunction(WINDOW_SPARGO_JS_TEST + "isActiveWindowIsMessageBox('" + controlType + "','" + windowId + "') == true");
};

//проверяем вхождение строк в сообщение MessageBox-а
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