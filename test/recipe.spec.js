const assert = require('chai').assert;
const {signInAndOpenDoctorApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');
const {openDocument, openDocumentList} = require('./controlHelper.js');

describe('recipe work', async  () => {
    let page;

    before(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl(page);
        await signInAndOpenDoctorApp(page);
    });

    after(async function () { /* after hook for mocah testing */
        await page.close();
    });

    it('should open recipe list', async () => {
        await openDocumentList(page, 'DOCTOR', 'DOCTOR_RECIPE');
        await openDocument(page, 'DOCTOR', 'RECIPE');
        await page.waitFor(1000);
    });
});