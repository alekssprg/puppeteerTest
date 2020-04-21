const sql = require('mssql');
const baseSettingsPath = '../../testData/baseSettings.json'

/**
 * Выполнение SQL запроса
 * @param {string} query sql запрос
 */
async function executeQuery (query) {
    let pool = await getPool();
    await pool.request().query(query);
};

/**
 * Открываем соедиение с БД
 */
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

module.exports.executeQuery = executeQuery
