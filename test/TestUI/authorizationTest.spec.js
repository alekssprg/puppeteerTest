const assert = require('chai').assert;
const { signIn, openDoctorApp } = require('./loginPage.js');
const { createPageAndGotoBaseUrl } = require('./startApp.js');

describe('Авторизация', async () => {
    let page;

    beforeEach(async () => { /* before hook for mocha testing */
        page = await createPageAndGotoBaseUrl();
    });

    afterEach(async function () { /* after hook for mocah testing */
        await page.close();
    });

    it('успешно авторизуется, открывает АРМ Врача', async () => {
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
