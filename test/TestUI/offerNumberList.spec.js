//методы
const assert = require('chai').assert;
const {signInAndOpenExpertApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');
const {openDocument, openDocumentList, getJournalDataByCode, getDocumentDataByCode} = require('./controlHelper.js');
const {selectGridPanelElement, clickToolbarButton, waitByControlTypeLoad, gridPanelDataExists, waitAjaxRequestComplete, controlToolbarId } = require('./baseListControl.js');
//данные
const baseSettings = require('../../testData/baseSettings.json');
const ARM_CODE = baseSettings.EXPERT_ARM_CODE;
const JOURNAL_CODE = 'OFFER_NUMBER';
const DOCUMENT_CODE = 'OFFER_NUMBER';
const Jour = getJournalDataByCode(ARM_CODE, JOURNAL_CODE);
const Doc = getDocumentDataByCode(ARM_CODE, DOCUMENT_CODE);

describe('offerNumberList work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenExpertApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        //await page.waitFor(1000);
        await page.close();
    });

    it('should open offerNumber list and load edit form', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await openDocument(page, ARM_CODE, DOCUMENT_CODE);
    });

    it('should open offerNumber list and click Refresh', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Refresh", Jour.ToolbarId));
        await Promise.all([
            await gridPanelDataExists(page, Jour.ControlType, Jour.GridPanelId),
            //await waitAjaxRequestComplete(page) //может не срабатывать
        ]);
    });

    it('should open offerNumber list and click Add new Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Add", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
    });

    it('should open offerNumber list and click Edit on second Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 1);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Edit", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
    });

    it('should open offerNumber list and click Copy first Item', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement (page, Jour.ControlType, Jour.GridPanelId, 0);
        await clickToolbarButton(page, Jour.ControlType, controlToolbarId("Copy", Jour.ToolbarId));
        await waitByControlTypeLoad(page, Doc.ControlType);
    });
    
});