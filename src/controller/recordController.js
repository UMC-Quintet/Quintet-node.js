const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const recordService = require("../service/recordService");
const recordProvider = require("../provider/recordProvider");
const moment = require('moment-timezone');

exports.postTodayChecks = async function (req, res) {
    //const user_id = req.user.user_id;
    const { work_deg, health_deg, family_deg, relationship_deg, money_deg } = req.body;

    const KST = moment().tz('Asia/Seoul');
    const todayDate = KST.format('YYYY-MM-DD');
    console.log(todayDate);

    const checkDuplicate = await recordProvider.checkDuplicateData(req.user_id, todayDate);

    if(checkDuplicate.length !== 0){
        return res.send(errResponse(baseResponse.DUPLICATE_DATA));
    } else {
        const postTodayChecksResult = await recordService.todayChecks(req.user_id, todayDate, work_deg, health_deg, family_deg, relationship_deg, money_deg);

        return res.send(postTodayChecksResult);
    }
};

exports.patchTodayRecord = async function (req, res) {
    //const user_id = req.user.user_id;
    const { work_doc, health_doc, family_doc, relationship_doc, money_doc } = req.body;

    const KST = moment().tz('Asia/Seoul');
    const todayDate = KST.format('YYYY-MM-DD');
    console.log(todayDate);

    const patchTodayRecordsResult = await recordService.todayRecords(req.user_id, todayDate, work_doc, health_doc, family_doc, relationship_doc, money_doc);

    return res.send(patchTodayRecordsResult);
};

exports.getRecordsByDate = async function (req, res) {
    //const user_id = req.user.user_id;
    const { year, month } = req.query;

    const recordsListByDate = await recordProvider.getRecordsByDate(req.user_id, year, month);

    return res.send(response(baseResponse.SUCCESS, recordsListByDate));
};

exports.getRecordsByElement = async function (req, res) {
    //const user_id = req.user.user_id;
    const {user_id, year, month, element } = req.query;

    const recordsListByElement = await recordProvider.getRecordsByElement(user_id, year, month, element);

    return res.send(response(baseResponse.SUCCESS, recordsListByElement));
};