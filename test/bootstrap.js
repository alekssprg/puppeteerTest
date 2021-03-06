/* Import the puppeteer and expect functionality of chai library for configuraing the Puppeteer */
const puppeteer = require('puppeteer');
const _ = require('lodash');
const opn = require('opn')
const cmd = require('node-cmd')
const baseSettings = require('../testData/baseSettings');

/* create the global variable by using lodash function */
const globalVariables = _.pick(global, ['browser', 'expect']);

/* configurable options or object for puppeteer */
const options = {
    headless: baseSettings.headless, //headless (без оконный) режим работает только на ИИС. При запуске в студии не работает
    slowMo: baseSettings.slowMotion,   //замедление действий пользователя
    timeout: 0,
    args: ['--start-maximized']
    /*разобраться, что значат для режима без окна
    args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--window-size=1920x1080'
    ]*/
}

/* call the before for puppeteer for execute this code before start testing */
before(async () => {
    global.browser = await puppeteer.launch(options);
});

/* call the function after puppeteer done testing */
after(() => {
    browser.close();
    global.browser = globalVariables.browser;
    global.expect = globalVariables.expect;
    //запускаем веб-сервер и открываем отчет
    if (baseSettings.openTestResults) {
        setTimeout(() => cmd.run('node server.js'), 5000);
        setTimeout(() => opn('http://localhost:9988'), 2000);
    }
});
