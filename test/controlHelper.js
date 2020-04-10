const journalDataPath = '../testData/journalDataSettings.json'
const journalDataAll = require(journalDataPath);
const documentDataPath = '../testData/documentDataSettings.json'
const documentDataAll = require(documentDataPath);

//Открытие журнала документов
module.exports.openDocumentList = async function(page, armCode, journalCode) {
    const journalData = getJournalDataByCode(armCode, journalCode);
    await page.evaluate((data) => {
        debugger;
        window.SpargoJs.Utils.showTab({ 
            url: data.Url,
            title: data.Title,
            data: '' });
        }, journalData);
    //await page.waitFor(500);//ожидание для полной отрисовки контролов
    const watchControlLoad = page.waitForFunction(journalData.WaitCondition);
    await watchControlLoad;
};

function getJournalDataByCode (armCode, journalCode) {
    return journalDataAll[armCode][journalCode];
};

function getDocumentDataByCode (armCode, documentCode) {
    return documentDataAll[armCode][documentCode];
};

//открытие формы редактирования документа
module.exports.openDocument = async function(page, armCode, documentCode) {
    const documentData = getDocumentDataByCode(armCode, documentCode);
    await page.evaluate((data) => {
        debugger;
        //метод будет работать только после загрузки первого контрола с типом AbstractServiceControl
        let args = {
            url: data.Url,
            //название
            title: data.Title,
            //функция по закрытию
            onclose: '',
            //ID окна
            idEx: 'WindowExt0',            
        };
        //параметры, которые обычно передаются при вызове контрола
        args = Object.assign({}, args, data.Args);
        window.App.direct.LoadExt(args);
    }, documentData);
    const watchControlLoad = page.waitForFunction(documentData.WaitCondition);
    await watchControlLoad;
};