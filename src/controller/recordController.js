const recordService = require("../service/recordService");

exports.postTodayChecks = async function (req, res) {
    const {email, work_deg, health_deg, family_deg, relationship_deg, money_deg} = req.body;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth()+1;
    const day = today.getDate();
    const dateString = year + "-" + month + "-" + day;
    console.log(dateString);

    const postTodayChecksResult = await recordService.todayChecks(email, dateString, work_deg, health_deg, family_deg, relationship_deg, money_deg);

    return res.send(postTodayChecksResult);
};

exports.patchTodayRecord = async function (req, res) {
    const { email, work_doc, health_doc, family_doc, relationship_doc, money_doc } = req.body;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth()+1;
    const day = today.getDate();
    const dateString = year + "-" + month + "-" + day;
    console.log(dateString);

    const patchTodayRecordsResult = await recordService.todayRecords(email, dateString, work_doc, health_doc, family_doc, relationship_doc, money_doc);

    return res.send(patchTodayRecordsResult);
};