const journalDataPath = '../testData/journalDataSettings.json'
/**
 * Мета данные по журналам
 */
const journalDataAll = require(journalDataPath);
const documentDataPath = '../testData/documentDataSettings.json'
/**
 * Мета данные по документам
 */
const documentDataAll = require(documentDataPath);
/**
 * Путь к скриптам тестов
 */
const WINDOW_SPARGO_JS_TEST = "window.SpargoJs.Test.";
/**
 * ID окна, создаваемого методом ExtAjaxHelper.LoadUserControlModalExt
 */
const EDIT_FORM_WINDOW_EXT_ID = 'WindowExt0';

//Открытие журнала документов
/**
 * Открытие журнала документов
 * @param {object} page страница браузера
 * @param {string} armCode код АРМ-а
 * @param {string} journalCode код журнала
 */
async function openDocumentList (page, armCode, journalCode) {
    const journalData = getJournalDataByCode(armCode, journalCode);
    await page.evaluate((data) => {
        window.SpargoJs.Utils.showTab({ 
            url: data.Url,
            title: data.Title,
            data: '' });
        }, journalData);
    //await page.waitFor(500);//ожидание для полной отрисовки контролов
    await page.waitForFunction(createWaitConditionByControlType(journalData.ControlType));
};
/**
 * Получение мета данных (настроек) журнала
 * @param {string} armCode код АРМ-а
 * @param {string} journalCode код журнала
 */
function getJournalDataByCode (armCode, journalCode) {
    return journalDataAll[armCode][journalCode];
};
/**
 * Получение мета данных (настроек) документа
 * @param {string} armCode код АРМ-а
 * @param {string} documentCode код документа
 */
function getDocumentDataByCode (armCode, documentCode) {
    return documentDataAll[armCode][documentCode];
};
/**
 * Формирование функции для ожидания загрузки контрола
 * @param {string} waitControlType 
 */
function createWaitConditionByControlType(waitControlType){
    return WINDOW_SPARGO_JS_TEST + "getLastControlId('" + waitControlType + "') != null";
};

/**
 * Открытие формы редактирования документа
 * @param {object} page страница браузера
 * @param {string} armCode код АРМ-а
 * @param {string} documentCode код документа
 */
async function openDocument(page, armCode, documentCode) {
    const documentData = getDocumentDataByCode(armCode, documentCode);
    await page.evaluate((data, windowId) => {
        //метод будет работать только после загрузки первого контрола с типом AbstractServiceControl
        let args = {
            url: data.Url,
            //название
            title: data.Title,
            //функция по закрытию
            onclose: '',
            //ID окна
            idEx: windowId
        };
        //параметры, которые обычно передаются при вызове контрола
        args = Object.assign({}, args, data.Args);
        window.App.direct.LoadExt(args);
    }, documentData, EDIT_FORM_WINDOW_EXT_ID);
    await page.waitForFunction(createWaitConditionByControlType(documentData.ControlType));
};

module.exports.createWaitConditionByControlType = createWaitConditionByControlType
module.exports.WINDOW_SPARGO_JS_TEST = WINDOW_SPARGO_JS_TEST
module.exports.EDIT_FORM_WINDOW_EXT_ID = EDIT_FORM_WINDOW_EXT_ID
module.exports.openDocumentList = openDocumentList
module.exports.openDocument = openDocument
module.exports.getJournalDataByCode = getJournalDataByCode
module.exports.getDocumentDataByCode = getDocumentDataByCode