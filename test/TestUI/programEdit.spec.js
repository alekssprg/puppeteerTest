'use strict'
//методы
const { signInAndOpenDoctorApp } = require('./loginPage.js');
const { createPageAndGotoBaseUrl } = require('./startApp.js');
const { openDocumentList, EDIT_FORM_WINDOW_EXT_ID, getJournalDataByCode, getDocumentDataByCode } = require('./controlHelper.js');
const { clickToolbarButton, waitByControlTypeLoad, waitWindowClose, selectGridPanelElement } = require('./baseListControl.js');
const { FIELD_TYPE, FormField, fillProgramEditForm } = require('./baseEditControl.js');
const { executeQuery } = require('./mssqlHelper.js');
//данные
const baseSettings = require('../../testData/baseSettings');
const ARM_CODE = baseSettings.DOCTOR_ARM_CODE;
const JOURNAL_CODE = 'PROGRAM';
const DOCUMENT_CODE = 'PROGRAM';
const Jour = getJournalDataByCode(ARM_CODE, JOURNAL_CODE);
const Doc = getDocumentDataByCode(ARM_CODE, DOCUMENT_CODE);
const JourPT = getJournalDataByCode(ARM_CODE, 'PROGRAM_TYPE');

/**
 * Массив полей формы - Вариант с поиском полей по коду
 */
let fieldArrayAdd = [ 
    new FormField("PROGRAM_CODE","TEST",FIELD_TYPE.TEXT),
    new FormField("PROGRAM_SHORT_NAME","Тест",FIELD_TYPE.TEXT),
    new FormField("PROGRAM_FULL_NAME","Тест Полное название",FIELD_TYPE.TEXT),
    new FormField("PROGRAM_TYPE_NAME","",FIELD_TYPE.SELECT, JourPT.ControlType, JourPT.GridPanelId, EDIT_FORM_WINDOW_EXT_ID,  JourPT.gridDoubleClickHandler),
    new FormField("PROGRAM_DATE_START","1.01.2020",FIELD_TYPE.DATE),
    new FormField("PROGRAM_DATE_FINISH","2.01.2020",FIELD_TYPE.DATE),
    new FormField("CAN_IMPORT_INDIVIDUAL",true,FIELD_TYPE.BOOLEAN),
    new FormField("SOCPROT_ASSIGNMENT_CODE","Льгота",FIELD_TYPE.EXTENDSSTATUSCOMBOBOX),
    new FormField("SOCPROT_IS_MONETIZATION",false,FIELD_TYPE.BOOLEAN)
];
/**
 * Массив полей формы для копирования
 */
let fieldArrayCopy = [...fieldArrayAdd]; //используем spread, чтобы не изменять первый массив
fieldArrayCopy[0] = new FormField("PROGRAM_CODE","TEST_COPY",FIELD_TYPE.TEXT);
fieldArrayCopy[1] = new FormField("PROGRAM_SHORT_NAME","Тест копия",FIELD_TYPE.TEXT);
fieldArrayCopy[2] = new FormField("PROGRAM_FULL_NAME","Тест копия Полное название",FIELD_TYPE.TEXT);

/**
 * Очистка данных после выполнения тестов 
 */
async function ClearData() {
    await executeQuery(`DELETE FROM PROGRAM WHERE program_code like '%TEST%'`);
};

describe('programEditForm work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenDoctorApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        //await page.waitFor(1000);   //для визуальной проверки
        await page.close();
    });

    after(async function() {
        await ClearData();
    });

    it('should open programlist call Add open EditForm Fill and Save new Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, "Add");
        await waitByControlTypeLoad(page, Doc.ControlType);
        await fillProgramEditForm(page, Doc.ControlType, Doc.FormId, fieldArrayAdd);
        await clickToolbarButton(page, Doc.ControlType, "SaveData");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });

    it('should open program list call Edit open EditForm and Save', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 1);
        await clickToolbarButton(page, Jour.ControlType, "Edit");
        await waitByControlTypeLoad(page, Doc.ControlType);
        await clickToolbarButton(page, Doc.ControlType, "SaveData");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });

    it('should open programlist call Copy open EditForm Fill and Save new Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 0);
        await clickToolbarButton(page, Jour.ControlType, "Copy");
        await waitByControlTypeLoad(page, Doc.ControlType);
        await fillProgramEditForm(page, Doc.ControlType, Doc.FormId, fieldArrayCopy);
        await clickToolbarButton(page, Doc.ControlType, "SaveData");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });

    it('should open program list call Edit open EditForm and Close', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 1);
        await clickToolbarButton(page, Jour.ControlType, "Edit");
        await waitByControlTypeLoad(page, Doc.ControlType);
        await clickToolbarButton(page, Doc.ControlType, "CloseData");
        await waitWindowClose(page, Doc.ControlType, EDIT_FORM_WINDOW_EXT_ID);
    });
});