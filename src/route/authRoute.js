const dotenv = require('dotenv');
const auth = require('../controller/authController');

dotenv.config();

module.exports = function (app) {
    //app.get(), app.post() ...
    app.post('/auth/google', auth.loginGoogleUser);
}