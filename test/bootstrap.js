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
    headless: false,
    slowMo: 100,
    timeout: 0,
    args: ['--start-maximized', '--window-size=1920,1040'] 
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
  setTimeout( () => { cmd.run('node server.js');}, 5000);
  setTimeout(() => {opn('http://localhost:9988');}, 2000);
});