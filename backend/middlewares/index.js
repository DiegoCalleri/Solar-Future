const cors = require('./cors');
const { digitalWrite, analogRead } = require('./arduino_api');
const { checkAuth, checkCookiesJWT } = require('./auth');

module.exports = {
    cors, 
    digitalWrite,
    checkAuth, 
    checkCookiesJWT,
    analogRead
}