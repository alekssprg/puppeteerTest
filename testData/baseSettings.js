require('dotenv').config()

module.exports = {
    startUrl: process.env.WEB_START_URL || 'http://localhost:60000/',
    serviceBaseUrl: process.env.SERVICE_BASE_URL || 'http://localhost:60003/',
    width: 1920,
    height: 1040,
    DOCTOR: '#DOCTOR',
    EXPERT: '#EXPERT',
    DRUGSTORE: '#DRUGSTORE',
    ADMIN: '#ADMIN',
    DIRECTOR: '#DIRECTOR',
    dbconnection: {
        SQLSERVER: process.env.DB_HOST || 'localhost\\SQLSERVER2016',
        username: process.env.DB_USERNAME || 'sa',
        password: process.env.DB_PASSWORD || '1',
        dbname: process.env.DB_DATABASE || 'efs_murmansk'
    },
    DOCTOR_ARM_CODE: 'DOCTOR',
    EXPERT_ARM_CODE: 'EXPERT',
    DRUGSTORE_ARM_CODE: 'DRUGSTORE',
    ADMIN_ARM_CODE: 'ADMIN',
    DIRECTOR_ARM_CODE: 'DIRECTOR',
    headless: JSON.parse(process.env.TEST_HEADLESS || true),
    slowMotion: process.env.TEST_SLOW_MOTION || 0,
    openTestResults: JSON.parse(process.env.TEST_OPEN_RESULTS || false),
}
