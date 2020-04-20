/* Import the puppeteer and expect functionality of chai library for configuraing the Puppeteer */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const _ = require('lodash');
const opn = require('opn')
const cmd = require('node-cmd')

/* create the global variable by using lodash function */
const globalVariables = _.pick(global, ['browser', 'expect']);

/* configurable options or object for puppeteer */
const opts = {
    headless: false, //headless (без оконный) режим работает только на ИИС. При запуске в студии не работает
    //slowMo: 100,   //замедление действий пользователя
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
before (async () => {
  global.expect = expect;
  global.browser = await puppeteer.launch(opts);
});

/* call the function after puppeteer done testing */
after ( () => {
  browser.close();
  global.browser = globalVariables.browser;
  global.expect = globalVariables.expect;
  //запускаем веб-сервер и открываем отчет
  //setTimeout( () => { cmd.run('node server.js');}, 5000);
  //setTimeout(() => {opn('http://localhost:9988');}, 2000);
});