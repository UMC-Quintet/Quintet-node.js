module.exports = function (app) {
    const record = require("../controller/recordController");
    //app.get(), app.post() ...
    app.post('/record', record.postTodayChecks);

    app.patch('/record', record.patchTodayRecord);
}