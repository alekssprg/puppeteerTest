require('dotenv').config()

module.exports = {
    loginInputId: '#login',
    passwordInputId: '#password',
    submitSelector: '[class=btn-login]',
    login: process.env.WEB_LOGIN || 'admin',
    password: process.env.WEB_PASSWORD || '1234567',
    exit: '#buttonLogin',
    logout: '[class=btn-logout]'
}
