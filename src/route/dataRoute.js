//dataRoute.js
module.exports = function(app){
    const data = require('../controller/dataController');

    app.post('/save_data', data.postData);

};