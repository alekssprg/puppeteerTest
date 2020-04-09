const authDataPath = '../testData/authorizateData.json'
const baseSettingsPath = '../testData/baseSettings.json'

//функция открытия АРМ-а по указанному коду
async function openApp(page, appCode) {
    var baseSettings = require(baseSettingsPath);
    (await page.$(baseSettings[appCode])).click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
};
//открыть АРМ-врача
async function openDoctorApp (page) {
    await openApp(page, "DOCTOR");
};
//открыть АРМ-фармацевта
async function openDrugstoreApp (page) {
await openApp(page, "DRUGSTORE");
};
//открыть АРМ-эксперта
async function openExpertApp (page) {
await openApp(page, "EXPERT");
};
//открыть АРМ-админа
async function openAdminApp (page) {
await openApp(page, "ADMIN");
};
//открыть АРМ-директора
async function openDirectorApp(page) {
await openApp(page, "DIRECTOR");
};

async function signIn (page) {
        var authData = require(authDataPath);
        
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
async function signInAndOpenDoctorApp (page) {
        await signIn(page);
        await openDoctorApp(page);
    };
async function signInAndOpenDrugstoreApp(page) {
        await signIn(page);
        await openDrugstoreApp(page);
    };
async function signInAndOpenExpertApp(page) {
        await signIn(page);
        await openExpertApp(page);
    };
async function signInAndOpenAdminApp(page) {
        await signIn(page);
        await openAdminApp(page);
    };
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