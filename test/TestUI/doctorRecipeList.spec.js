//методы
const assert = require('chai').assert;
const {signInAndOpenDoctorApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');
const {openDocument, openDocumentList, getJournalDataByCode, getDocumentDataByCode} = require('./controlHelper.js');
const {selectGridPanelElement, clickToolbarButton, waitByControlTypeLoad, gridPanelDataExists, controlToolbarId } = require('./baseListControl.js');
//данные
const baseSettings = require('../../testData/baseSettings');
const ARM_CODE = baseSettings.DOCTOR_ARM_CODE;
const JOURNAL_CODE = 'DOCTOR_RECIPE';
const DOCUMENT_CODE = 'RECIPE';
const Jour = getJournalDataByCode(ARM_CODE, JOURNAL_CODE);
const Doc = getDocumentDataByCode(ARM_CODE, DOCUMENT_CODE);
//константы
const CLEAN_FILTER_BUTTON_ID = 'cleanFilters';

describe('doctorRecipeList work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenDoctorApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        //await page.waitFor(1000);    //для визуальной проверки
        await page.close();
    });

    it('should open recipe list', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await openDocument(page, ARM_CODE, DOCUMENT_CODE);
    });
    
    it('should open recipe list and click Refresh', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, CLEAN_FILTER_BUTTON_ID);
        await Promise.all([
            await gridPanelDataExists(page, Jour.ControlType, Jour.GridPanelId)//,
            //await waitAjaxRequestComplete(page)
        ]);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Refresh", Jour.ToolbarId));
        await Promise.all([
            await gridPanelDataExists(page, Jour.ControlType, Jour.GridPanelId)//,
            //await waitAjaxRequestComplete(page)
        ]);
    });

    it('should open recipe list and click Add new Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Add", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
    });

    it('should open recipe list and click Edit on second Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, CLEAN_FILTER_BUTTON_ID);
        await Promise.all([
            await gridPanelDataExists(page, Jour.ControlType, Jour.GridPanelId)//,
            //await waitAjaxRequestComplete(page)
        ]);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 1);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Edit", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
    });

    it('should open recipe list and click Copy first Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, CLEAN_FILTER_BUTTON_ID);
        await Promise.all([
            await gridPanelDataExists(page, Jour.ControlType, Jour.GridPanelId)//,
            //await waitAjaxRequestComplete(page)
        ]);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 2);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Copy", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
    });
});