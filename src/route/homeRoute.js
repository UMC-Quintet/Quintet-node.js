module.exports = function(app){
    const home = require('../controller/homeController');
    app.get('/home', home.getHome);

};