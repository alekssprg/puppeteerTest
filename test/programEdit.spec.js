'use strict'
//методы
const {signInAndOpenDoctorApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');
const { openDocumentList} = require('./controlHelper.js');
const { getToolbarButton, waitByCondition, buttonClick,  waitWindowClose, selectGridPanelElement } = require('./baseListControl.js');
const {FIELD_TYPE, FormField, fillProgramEditForm} = require('./baseEditControl.js');
//данные
const baseSettings = require('../testData/baseSettings.json');
//константы
const DOCTOR_ARM_CODE = baseSettings.DOCTOR_ARM_CODE;
const JOURNAL_CODE = 'PROGRAM';
const CONTROL_TYPE = 'Programs';
const EDIT_FORM_CONTROL_TYPE = 'Program';
const GRID_PANEL_ID = 'masterGrid';
const FORM_ID = "detailForm";
//условия ожидания
const WAIT_EDIT_FORM_OPEN_CONDITION = 'window.App.direct.Program != null';
const EDIT_FROM_WINDOW_ID = 'WindowExt0';

describe('programEditForm work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenDoctorApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        await page.waitFor(1000);   //для визуальной проверки
        await page.close();
    });

    let fieldArrayAdd = [ 
                new FormField("PROGRAM_CODE","TEST",FIELD_TYPE.TEXT),
                new FormField("PROGRAM_SHORT_NAME","Тест",FIELD_TYPE.TEXT),
                new FormField("PROGRAM_FULL_NAME","Тест Полное название",FIELD_TYPE.TEXT),
                new FormField("PROGRAM_TYPE_NAME","",FIELD_TYPE.SELECT, "ProgramTypes", "programTypesGrid", "window.App.direct.ProgramTypes != null", "WindowExt0"),
                new FormField("PROGRAM_DATE_START","1.01.2020",FIELD_TYPE.DATE),
                new FormField("PROGRAM_DATE_FINISH","2.01.2020",FIELD_TYPE.DATE),
                new FormField("CAN_IMPORT_INDIVIDUAL",true,FIELD_TYPE.BOOLEAN),
                new FormField("SOCPROT_ASSIGNMENT_CODE","Льгота",FIELD_TYPE.EXTENDSSTATUSCOMBOBOX),
                new FormField("SOCPROT_IS_MONETIZATION",false,FIELD_TYPE.BOOLEAN)
    ];

    let fieldArrayCopy = [...fieldArrayAdd]; //используем spread, чтобы не изменять первый массив
    fieldArrayCopy[0] = new FormField("PROGRAM_CODE","TEST_COPY",FIELD_TYPE.TEXT);
    fieldArrayCopy[1] = new FormField("PROGRAM_SHORT_NAME","Тест копия",FIELD_TYPE.TEXT);
    fieldArrayCopy[2] = new FormField("PROGRAM_FULL_NAME","Тест копия Полное название",FIELD_TYPE.TEXT);

    it('should open programlist call Add open EditForm Fill and Save new Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Add");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_OPEN_CONDITION);
        await fillProgramEditForm(page, EDIT_FORM_CONTROL_TYPE, FORM_ID, fieldArrayAdd);
        let buttonSave = await getToolbarButton(page, EDIT_FORM_CONTROL_TYPE, "SaveData");
        await buttonClick(buttonSave);
        await waitWindowClose(page, EDIT_FORM_CONTROL_TYPE, EDIT_FROM_WINDOW_ID);
    });

    it('should open program list call Edit open EditForm and Save', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 1);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Edit");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_OPEN_CONDITION);
        let buttonSave = await getToolbarButton(page, EDIT_FORM_CONTROL_TYPE, "SaveData");
        await buttonClick(buttonSave);
        await waitWindowClose(page, EDIT_FORM_CONTROL_TYPE, EDIT_FROM_WINDOW_ID);
    });

    it('should open programlist call Copy open EditForm Fill and Save new Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 0);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Copy");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_OPEN_CONDITION);
        await fillProgramEditForm(page, EDIT_FORM_CONTROL_TYPE, FORM_ID, fieldArrayCopy);
        let buttonSave = await getToolbarButton(page, EDIT_FORM_CONTROL_TYPE, "SaveData");
        await buttonClick(buttonSave);
        await waitWindowClose(page, EDIT_FORM_CONTROL_TYPE, EDIT_FROM_WINDOW_ID);
    });

    it('should open program list call Edit open EditForm and Close', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 1);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Edit");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_OPEN_CONDITION);
        let buttonSave = await getToolbarButton(page, EDIT_FORM_CONTROL_TYPE, "CloseData");
        await buttonClick(buttonSave);
        await waitWindowClose(page, EDIT_FORM_CONTROL_TYPE, EDIT_FROM_WINDOW_ID);
    });
});