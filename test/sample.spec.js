//const { expect } = require('chai');
var should = require('chai').should();

describe('simple test for LgotaWeb Login functionality', async  () => {
    let page;
    
    before(async () => { /* before hook for mocha testing */
        page = await browser.newPage();
        await page.goto("http://localhost:60000/", {waitUntil: 'networkidle2'});
        await page.setViewport( { width: 1920, height: 1040} );
    });

    after(async function () { /* after hook for mocah testing */
        await page.close();
    });

    it('should login to DOCTOR APP', async () => { /* simple test case */
        const loginInput = "#login";
        const passwordInput = "#password";
        const submitSelector = "[class=btn-login]";
		const doctorApp = "#DOCTOR";

        await (await page.$(loginInput)).type('admin');
        await (await page.$(passwordInput)).type('1234567');
        (await page.$(submitSelector)).click();
		await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        (await page.$(doctorApp)).click();
        /*аналог предыдущей строки: 
        const doctorAppBtn = await page.evaluateHandle(() => {
            debugger;
            return document.querySelector("#DOCTOR");
        });
        await doctorAppBtn.click();*/

		await page.waitForNavigation({ waitUntil: 'networkidle0' });
		
		const panelTreeWidth = await page.evaluate(() => {
            //debugger;
            return window.App['panelTree'].el.dom.style.width;
			//return JSON.stringify(window.App['panelTree'].el.dom);
		  });
        panelTreeWidth.should.equal('225px');
        
        const panelTree = await page.evaluateHandle(() => {
            //debugger;
            return window.App['panelTree'].el.dom;
        });
        await panelTree.click();
        //await page.waitFor(3000);
    });
});