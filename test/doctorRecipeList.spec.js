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
const JOURNAL_CODE = 'DOCTOR_RECIPE';
const DOCUMENT_CODE = 'RECIPE'
const TOOLBAR_ID = 'toolbar1_tool';
const CONTROL_TYPE = 'DoctorRecipes';
const GRID_PANEL_ID = 'recipesGrid';
const CLEAN_FILTER_BUTTON_ID = 'cleanFilters';
//условия ожидания
const WAIT_EDIT_FORM_CONDITION = 'window.App.direct.DoctorRecipe != null';

describe('doctorRecipeList work', async  () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
        await signInAndOpenDoctorApp(page);
    });

    afterEach(async function () { /* after hook for mocah testing */
        await page.waitFor(1000);
        await page.close();
    });

    it('should open recipe list', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        await openDocument(page, DOCTOR_ARM_CODE, DOCUMENT_CODE);
    });

    it('should open recipe list and click Refresh', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        var clearFilterButton = await getToolbarButton(page, CONTROL_TYPE, CLEAN_FILTER_BUTTON_ID);
        await buttonClick(clearFilterButton);
        await Promise.all([
            await gridPanelDataExists(page, CONTROL_TYPE, GRID_PANEL_ID)//,
            //await waitAjaxRequestComplete(page)
        ]);
        var button = await getToolbarButton(page, CONTROL_TYPE, "Refresh", TOOLBAR_ID);
        await buttonClick(button);
        await Promise.all([
            await gridPanelDataExists(page, CONTROL_TYPE, GRID_PANEL_ID)//,
            //await waitAjaxRequestComplete(page)
        ]);
    });

    it('should open recipe list and click Add new Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        var button = await getToolbarButton(page, CONTROL_TYPE, "Add", TOOLBAR_ID);
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_CONDITION);
    });

    it('should open recipe list and click Edit on second Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        var clearFilterButton = await getToolbarButton(page, CONTROL_TYPE, CLEAN_FILTER_BUTTON_ID);
        await buttonClick(clearFilterButton);
        await Promise.all([
            await gridPanelDataExists(page, CONTROL_TYPE, GRID_PANEL_ID)//,
            //await waitAjaxRequestComplete(page)
        ]);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 1);
        var button = await getToolbarButton(page, CONTROL_TYPE, "Edit", TOOLBAR_ID);
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_CONDITION);
    });

    it('should open recipe list and click Copy first Item', async () => {
        await openDocumentList(page, DOCTOR_ARM_CODE, JOURNAL_CODE);
        var clearFilterButton = await getToolbarButton(page, CONTROL_TYPE, CLEAN_FILTER_BUTTON_ID);
        await buttonClick(clearFilterButton);
        await Promise.all([
            await gridPanelDataExists(page, CONTROL_TYPE, GRID_PANEL_ID)//,
            //await waitAjaxRequestComplete(page)
        ]);
        await selectGridPanelElement (page, CONTROL_TYPE, GRID_PANEL_ID, 2);
        var button = await getToolbarButton(page, CONTROL_TYPE, "Copy", TOOLBAR_ID);
        await buttonClick(button);
        await waitByCondition(page, WAIT_EDIT_FORM_CONDITION);
    });
});