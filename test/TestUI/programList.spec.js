//методы
const assert = require('chai').assert;
const { signInAndOpenDoctorApp } = require('./loginPage.js');
const { createPageAndGotoBaseUrl } = require('./startApp.js');
const { openDocument, openDocumentList, getJournalDataByCode, getDocumentDataByCode } = require('./controlHelper.js');
const { selectGridPanelElement, clickToolbarButton, waitByControlTypeLoad, gridPanelDataExists, waitAjaxRequestComplete } = require('./baseListControl.js');
//данные
const baseSettings = require('../../testData/baseSettings');
const ARM_CODE = baseSettings.DOCTOR_ARM_CODE;
const JOURNAL_CODE = 'PROGRAM';
const DOCUMENT_CODE = 'PROGRAM';
const Jour = getJournalDataByCode(ARM_CODE, JOURNAL_CODE);
const Doc = getDocumentDataByCode(ARM_CODE, DOCUMENT_CODE);

describe('Справочник программ льгот', async () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenDoctorApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        //await page.waitFor(1000);
        await page.close();
    });

    it('открывает справочник и форму редактирования', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await openDocument(page, ARM_CODE, DOCUMENT_CODE);
    });

    it('открывает справочник и нажимает "Обновить"', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, "Refresh");
        await Promise.all([
            await gridPanelDataExists(page, Jour.ControlType, Jour.GridPanelId),
            //await waitAjaxRequestComplete(page) //может не срабатывать
        ]);
    });

    it('открывает справочник и нажимает "Добавить"', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await clickToolbarButton(page, Jour.ControlType, "Add");
        await waitByControlTypeLoad(page, Jour.ControlType);
    });

    it('открывает справочник и нажимает "Редактировать" на 2м элементе', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement(page, Jour.ControlType, Jour.GridPanelId, 1);
        await clickToolbarButton(page, Jour.ControlType, "Edit");
        await waitByControlTypeLoad(page, Jour.ControlType);
    });

    it('открывает справочник и нажимает "Копировать" на первом элементе', async () => {
        await openDocumentList(page, ARM_CODE, JOURNAL_CODE);
        await selectGridPanelElement(page, Jour.ControlType, Jour.GridPanelId, 0);
        await clickToolbarButton(page, Jour.ControlType, "Copy");
        await waitByControlTypeLoad(page, Jour.ControlType);
    });
});
