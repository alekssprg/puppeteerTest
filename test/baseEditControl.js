const { selectGridPanelElement, waitByCondition, waitWindowClose } = require('./baseListControl.js');
const FIELD_TYPE = { TEXT : "text", SELECT : "select", DATE : "date", BOOLEAN : "boolean",
NUMBER : "number", EXTENDSSTATUSCOMBOBOX: "extendsstatuscombobox" };

class FormField {
    constructor (name, value, type, selectControlType, selectGridPanelId, waitOpenFormCondition, selectWindowId){
       //поля будут публичные
       this.name = name;
       this.value = value;
       this.type = type;
       this.selectControlType = selectControlType;
       this.selectGridPanelId = selectGridPanelId;
       this.waitOpenFormCondition = waitOpenFormCondition;
       this.selectWindowId = selectWindowId;
    }
}

//ожидание заполнения поля формы не пустым значением
async function checkFieldValueValid (page, controlType, formId, fieldName) {
    await page.waitForFunction('window.SpargoJs.Test.formFieldValueValid("' + controlType + '","' + formId + '","' + fieldName + '")');
};

//заполнение полей формы редактирования
async function fillProgramEditForm(page, controlType, formId, fieldArray) {
    for(let i = 0; i < fieldArray.length; i++){
        let field = fieldArray[i];
        if ((field.type == FIELD_TYPE.TEXT)||(field.type == FIELD_TYPE.DATE)) {
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
    //await fieldElement.focus({delay: 50});//type(field.value);
    //await page.keyboard.type(field.value /*, { delay: 50 }*/);
    await checkFieldValueValid(page, controlType, formId, field.name);
};

//функция получения элемента формы по ID формы и имени поля
async function getElementByName(page, controlType, formId, fieldName) {
    let field = await page.evaluateHandle((controlType, formId, fieldName) => {
        debugger;
        return window.SpargoJs.Test.getFormFieldDom(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
    return field.asElement();
};

//функция очистки текстового поля, если оно не пустое
async function textFieldClearValueIfNotEmpty(page, controlType, formId, fieldName) {
    await page.evaluateHandle((controlType, formId, fieldName) => {
        debugger;
        return window.SpargoJs.Test.formTextFieldClearValueIfNotEmpty(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
};

//заполнение поля с триггером
async function fillTriggerField(page, controlType, formId, field) {
    let triggerButtonClear = await getTriggerFieldButton(page, controlType, formId, field.name, 1);
    await triggerButtonClear.click();
    let triggerButtonOpen = await getTriggerFieldButton(page, controlType, formId, field.name, 0);
    await triggerButtonOpen.click({clickCount:2});
    await waitByCondition(page, field.waitOpenFormCondition);
    await selectGridPanelElement(page, field.selectControlType, field.selectGridPanelId, 1);
    await gridPanelDoubleClickCall(page, field.selectControlType, field.selectGridPanelId);
    await waitWindowClose(page, field.selectControlType, field.selectWindowId);
    await checkFieldValueValid(page, controlType, formId, field.name);
};

//функция получения кнопки TriggerField-а (по умолчанию юерем первую кнопку - открыть справочник)
async function getTriggerFieldButton(page, controlType, formId, triggerFieldName, buttonIndex = 0) {
    let field = await page.evaluateHandle((controlType, formId, fieldName, buttonIndex) => {
        debugger;
        return window.SpargoJs.Test.getFormTriggerFieldButtonDom(controlType, formId, fieldName, buttonIndex);
    }, controlType, formId, triggerFieldName, buttonIndex);
    return field.asElement();
};

//вызов обработчика двойного щелчка у грида
async function gridPanelDoubleClickCall (page, controlType, gridPanelId) {
    await page.evaluate((controlType, gridPanelId) => {
        var gridPanel = window.SpargoJs.Test.getGridPanel(controlType, gridPanelId);
        window.SpargoJs.PatientPresentation.programTypesGridDoubleClick(gridPanel);
    }, controlType, gridPanelId);
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
    //await checkComboBoxValueValid(page, controlType, formId, field.name, field.value);
};

/*async function checkComboBoxValueValid(page, controlType, formId, field.name, field.value) {
    
};*/

//ждем открытия списка для комбобокса
async function formComboBoxBoundListIsOpen (page, controlType, formId, fieldName) {
    await page.waitForFunction('window.SpargoJs.Test.formComboBoxBoundListIsOpen("' + controlType + '","' + formId + '","' + fieldName + '")');
};

//функция получения элемента из выпадющего списка ComboBox-а
async function getComboBoxBoundListItem(page, controlType, formId, field) {
    let listItem = await page.evaluateHandle((controlType, formId, fieldName, textValue) => {
        debugger;
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
        debugger;
        return window.SpargoJs.Test.getCheckBoxValue(controlType, formId, fieldName);
    }, controlType, formId, fieldName);
};

module.exports.FIELD_TYPE = FIELD_TYPE
module.exports.FormField = FormField
module.exports.fillProgramEditForm = fillProgramEditForm