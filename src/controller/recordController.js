const baseResponse = require("../../config/baseResponseStatus");
const {response} = require("../../config/response");
const recordService = require("../service/recordService");
const recordProvider = require("../provider/recordProvider")

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

exports.postTodayChecks = async function (req, res) {
    //const user_id = req.user.user_id;
    const {user_id, work_deg, health_deg, family_deg, relationship_deg, money_deg} = req.body;

    const todayDate = getTodayDate();
    console.log(todayDate);

    const postTodayChecksResult = await recordService.todayChecks(user_id, todayDate, work_deg, health_deg, family_deg, relationship_deg, money_deg);

    return res.send(postTodayChecksResult);
};

exports.patchTodayRecord = async function (req, res) {
    //const user_id = req.user.user_id;
    const {user_id, work_doc, health_doc, family_doc, relationship_doc, money_doc } = req.body;

    const todayDate = getTodayDate();
    console.log(todayDate);

    const patchTodayRecordsResult = await recordService.todayRecords(user_id, todayDate, work_doc, health_doc, family_doc, relationship_doc, money_doc);

    return res.send(patchTodayRecordsResult);
};

exports.getRecordsByDate = async function (req, res) {
    //const user_id = req.user.user_id;
    const { user_id, year, month } = req.query;

    const recordsListByDate = await recordProvider.getRecordsByDate(user_id, year, month);

    return res.send(response(baseResponse.SUCCESS, recordsListByDate));
};

exports.getRecordsByElement = async function (req, res) {
    //const user_id = req.user.user_id;
    const {user_id, year, month, element } = req.query;

    const recordsListByElement = await recordProvider.getRecordsByElement(user_id, year, month, element);

    return res.send(response(baseResponse.SUCCESS, recordsListByElement));
};