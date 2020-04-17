//методы
const assert = require('chai').assert;
const {signInAndOpenDoctorApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');
const {openDocument, openDocumentList} = require('./controlHelper.js');
const {selectGridPanelElement, getToolbarButton, waitByCondition, buttonClick, gridPanelDataExists, waitAjaxRequestComplete } = require('./baseListControl.js');
//данные
const baseSettings = require('../testData/baseSettings.json');
//константы
const DOCTOR_ARM_CODE = baseSettings.DOCTOR_ARM_CODE;
const JOURNAL_CODE = 'PROGRAM';
const DOCUMENT_CODE = 'PROGRAM';
const CONTROL_TYPE = 'Programs';
const GRID_PANEL_ID = 'masterGrid';
//условия ожидания
const WAIT_EDIT_FORM_CONDITION = 'window.App.direct.Program != null';

describe('programList work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenDoctorApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        await page.waitFor(1000);
        await page.close();
    });

    it('should open program list and load edit form', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await openDocument(page, DOCTOR_ARM_CODE, DOCUMENT_CODE);
    });

    it('should open program list and click Refresh', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Refresh");
        await buttonClick(button);
        await Promise.all([
            await gridPanelDataExists(page, CONTROL_TYPE, GRID_PANEL_ID),
            await waitAjaxRequestComplete(page) //может не срабатывать
        ]);
    });

    it('should open program list and click Add new Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Add");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_CONDITION);
    });

    it('should open program list and click Edit on second Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 1);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Edit");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_CONDITION);
    });

    it('should open program list and click Copy first Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 0);
        let button = await getToolbarButton(page, CONTROL_TYPE, "Copy");
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_CONDITION);
    });
    
});