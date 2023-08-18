module.exports = function(app){
    const home = require('./homeController');

    app.get('/home', home.getHome);

};