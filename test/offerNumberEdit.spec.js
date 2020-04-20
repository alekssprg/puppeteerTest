'use strict'
//методы
const { signInAndOpenExpertApp } = require('./loginPage.js');
const { createPageAndGotoBaseUrl } = require('./startApp.js');
const { openDocumentList, EDIT_FORM_WINDOW_EXT_ID, getJournalDataByCode, getDocumentDataByCode } = require('./controlHelper.js');
const { clickToolbarButton, waitByControlTypeLoad, waitWindowClose, waitWindowActive, selectGridPanelElement, controlToolbarId } = require('./baseListControl.js');
const { FIELD_TYPE, MB_BUTTON_CODE, FormField, fillProgramEditForm, waitMessageBoxWithText } = require('./baseEditControl.js');
const { executeQuery } = require('./mssqlHelper.js');
//данные
const baseSettings = require('../testData/baseSettings.json');
const ARM_CODE = baseSettings.EXPERT_ARM_CODE;
const JOURNAL_CODE = 'OFFER_NUMBER';
const DOCUMENT_CODE = 'OFFER_NUMBER';
const Jour = getJournalDataByCode(ARM_CODE, JOURNAL_CODE);
const Doc = getDocumentDataByCode(ARM_CODE, DOCUMENT_CODE);
const JourP = getJournalDataByCode(baseSettings.DOCTOR_ARM_CODE, 'PROGRAM');    //используем АРМ-врача, так как контрол одинаковый
//ожидаемое сообщение
const WAIT_MESSAGE_BOX_TEXT = ['Заявочная','кампания','успешно','сохранена'];

//вариант с поиском полей по имени (по коду в комментарии)
let fieldArrayAdd = [ 
    new FormField("Номер"/*"NUMBER"*/,"1000",FIELD_TYPE.NUMBER),
    new FormField("Наименование"/*"NAME"*/,"Тест",FIELD_TYPE.TEXT),
    new FormField("Программа"/*"PROGRAM_FULL_NAME"*/,"",FIELD_TYPE.SELECT, JourP.ControlType, JourP.GridPanelId, EDIT_FORM_WINDOW_EXT_ID, JourP.gridDoubleClickHandler),
    new FormField("Финансовый год"/*"FINANCIAL_YEAR"*/,"2098",FIELD_TYPE.NUMBER)
];

let fieldArrayCopy = [...fieldArrayAdd]; //используем spread, чтобы не изменять первый массив
fieldArrayCopy[0] = new FormField("Номер"/*"NUMBER"*/,"1010",FIELD_TYPE.NUMBER);
fieldArrayCopy[1] = new FormField("Наименование"/*"NAME"*/,"Тест копия",FIELD_TYPE.TEXT);
fieldArrayCopy[3] = new FormField("Финансовый год"/*"FINANCIAL_YEAR"*/,"2099",FIELD_TYPE.TEXT);


//очистка данных после выполнения тестов
async function ClearData() {
    await executeQuery(`DELETE FROM TOTAL_NEED WHERE OFFER_NUMBER_GUID IN (SELECT GUID FROM OFFER_NUMBER WHERE FINANCIAL_YEAR > 2090)`);
    await executeQuery(`DELETE FROM OFFER_NUMBER WHERE FINANCIAL_YEAR > 2090`);
};

describe('offerNumberEditForm work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenExpertApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        //await page.waitFor(1000);   //для визуальной проверки
        await page.close();
    });

    after(async function() {
        await ClearData();
    });

    it('should open offerNumber list call Add open EditForm Fill and Save new Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Add", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
        await fillProgramEditForm(page, Doc.ControlType, Doc.FormId, fieldArrayAdd);
        await clickToolbarButton(page, Doc.ControlType, "buttonSave");
        await waitMessageBoxWithText(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID, WAIT_MESSAGE_BOX_TEXT, MB_BUTTON_CODE.OK);
        await waitWindowActive(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
        await clickToolbarButton(page, Doc.ControlType, "buttonClose");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });

    it('should open offerNumber call Copy open EditForm Fill and Save new Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 0);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Copy", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
        await fillProgramEditForm(page, Doc.ControlType, Doc.FormId, fieldArrayCopy);
        await clickToolbarButton(page, Doc.ControlType, "buttonSave");
        await waitMessageBoxWithText(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID, WAIT_MESSAGE_BOX_TEXT, MB_BUTTON_CODE.OK);
        await waitWindowActive(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
        await clickToolbarButton(page, Doc.ControlType, "buttonClose");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });

    it('should open offerNumber list call Edit open EditForm and Close', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 1);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Edit", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
        await clickToolbarButton(page, Doc.ControlType, "buttonClose");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });
});