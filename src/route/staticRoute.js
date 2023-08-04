module.exports = function (app) {
    const statics = require('../controller/staticController');

    //app.get(), app.post() ...
    app.get('/static/week', statics.getWeeklyStatic);
    app.get('/static/month', statics.getMonthlyStatic);
    app.get('/static/year', statics.getAnnualStatic)
}