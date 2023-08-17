module.exports = function(app){
    const home = require('../controller/homeController');

    app.get('/app/home', home.getHome);

};