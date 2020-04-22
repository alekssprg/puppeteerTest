const sql = require('mssql');

/**
 * Выполнение SQL запроса
 * @param {string} query sql запрос
 */
async function executeQuery(query) {
    let pool = await getPool();
    await pool.request().query(query);
};

/**
 * Открываем соедиение с БД
 */
async function getPool() {
    let dbconnection = require('../../testData/baseSettings').dbconnection;

    let pool = await sql.connect({
        user: dbconnection.username,
        password: dbconnection.password,
        server: dbconnection.SQLSERVER,
        database: dbconnection.dbname,
    });

    return pool;
}

module.exports.executeQuery = executeQuery
