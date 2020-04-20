const sql = require('mssql');
const baseSettingsPath = '../testData/baseSettings.json'

//Создание страницы и переход в базовому Url
module.exports.executeQuery = async function (query) {
    let pool = await getPool();
    await pool.request().query(query);
};

//открываем соедиение с БД
async function getPool() {
    let dbconnection = require(baseSettingsPath).dbconnection;
    const config = {
        user: dbconnection.username,
        password: dbconnection.password,
        server: dbconnection.SQLSERVER,
        database: dbconnection.dbname,
    };
    let pool = await sql.connect(config);
    return pool;
}
