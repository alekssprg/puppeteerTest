const assert = require('chai').assert;
const {signInAndOpenDoctorApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');
const {openDocument, openDocumentList} = require('./controlHelper.js');

describe('program work', async  () => {
    let page;

    before(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl(page);
        await signInAndOpenDoctorApp(page);
    });

    after(async function () { /* after hook for mocah testing */
        await page.close();
    });

    it('should open program list', async () => {
        await openDocumentList(page, 'DOCTOR', 'PROGRAM');
        await openDocument(page, 'DOCTOR', 'PROGRAM');
        await page.waitFor(1000);
    });
});