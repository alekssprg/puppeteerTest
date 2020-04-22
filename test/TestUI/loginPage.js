/**
 * Функция открытия АРМ-а по указанному коду 
 * @param {object} page страница браузера
 * @param {string} appCode 
 */
async function openApp(page, appCode) {
    var baseSettings = require('../../testData/baseSettings');
    (await page.$(baseSettings[appCode])).click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
};
/**
 * Открыть АРМ-врача
 * @param {object} page страница браузера
 */
async function openDoctorApp (page) {
    await openApp(page, "DOCTOR");
};

/**
 * Открыть АРМ-фармацевта
 * @param {object} page страница браузера
 */
async function openDrugstoreApp (page) {
    await openApp(page, "DRUGSTORE");
};
/**
 * Открыть АРМ-эксперта
 * @param {object} page страница браузера
 */
async function openExpertApp (page) {
    await openApp(page, "EXPERT");
};
/**
 * Открыть АРМ-админа
 * @param {object} page страница браузера
 */
async function openAdminApp (page) {
    await openApp(page, "ADMIN");
};
/**
 * Открыть АРМ-директора
 * @param {object} page страница браузера
 */
async function openDirectorApp(page) {
await openApp(page, "DIRECTOR");
};
/**
 * Авторизация и переход на страницу выбора АРМ-а
 * @param {object} page страница браузера
 */
async function signIn (page) {
        var authData = require('../../testData/authorizationData');

        var exitButton = await page.$(authData.exit);
        var logoutButton = await page.$(authData.logout);
        if (logoutButton)
        {
            //мы на нушной странице авторизация уже пройдена
        }
        //если мы уже в АРМ-е - выходим из АРМ-а на страницу выбора АРМ-ов
        else if (exitButton) {
            (await page.$(authData.exit)).click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
        } 
        //если мы еще не вошли - заходим
        else {
            await (await page.$(authData.loginInputId)).type(authData.login);
            await (await page.$(authData.passwordInputId)).type(authData.password);
            (await page.$(authData.submitSelector)).click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
        }
    };
/**
 * Авторизация и открытие АРМ-врача
 * @param {object} page страница браузера
 */
async function signInAndOpenDoctorApp (page) {
        await signIn(page);
        await openDoctorApp(page);
    };
/**
 * Авторизация и открытие АРМ-фармацевта
 * @param {object} page страница браузера
 */
async function signInAndOpenDrugstoreApp(page) {
        await signIn(page);
        await openDrugstoreApp(page);
    };
/**
 * Авторизация и открытие АРМ-эксперта
 * @param {object} page страница браузера
 */
async function signInAndOpenExpertApp(page) {
        await signIn(page);
        await openExpertApp(page);
    };
/**
 * Авторизация и открытие АРМ-админа
 * @param {object} page страница браузера
 */
async function signInAndOpenAdminApp(page) {
        await signIn(page);
        await openAdminApp(page);
    };
/**
 * Авторизация и открытие АРМ-директора
 * @param {object} page страница браузера
 */
async function signInAndOpenDirectorApp(page) {
        await signIn(page);
        await openDirectorApp(page);
    };
	
module.exports.signIn = signIn
module.exports.openDoctorApp = openDoctorApp
module.exports.openDrugstoreApp = openDrugstoreApp
module.exports.openExpertApp = openExpertApp
module.exports.openAdminApp = openAdminApp
module.exports.openDirectorApp = openDirectorApp
module.exports.signInAndOpenDoctorApp = signInAndOpenDoctorApp
module.exports.signInAndOpenDrugstoreApp = signInAndOpenDrugstoreApp
module.exports.signInAndOpenExpertApp = signInAndOpenExpertApp
module.exports.signInAndOpenAdminApp = signInAndOpenAdminApp
module.exports.signInAndOpenDirectorApp = signInAndOpenDirectorApp