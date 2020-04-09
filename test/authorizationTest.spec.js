const assert = require('chai').assert;
const {signIn, openDoctorApp} = require('./loginPage.js');
const {createPageAndGotoBaseUrl} = require('./startApp.js');

describe('Should login work', async  () => {
    let page;
    const baseSettingsPath = '../testData/baseSettings.json'
    before(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl(baseSettingsPath, page);
    });

    after(async function () { /* after hook for mocah testing */
        await page.close();
    });

    it('should login and open DoctorApp', async () => {
        await signIn(page);
        await openDoctorApp(page);
        assert(await getPanelTree(page) != null, "Дерево переходов не загрузилось.");
    });

    async function getPanelTree(page) {
        return await page.evaluateHandle(() => {
            return window.App['panelTree'].el.dom;
        });
    }
});
