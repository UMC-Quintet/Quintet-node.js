module.exports = function(app){
    const home = require('./homeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/home', home.getHome);

};