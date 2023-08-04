const {pool} = require("../../config/database");
const recordDao = require("../dao/recordDao");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");

//const {connect} = require("http2");
const dotenv = require('dotenv');

dotenv.config()

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.todayChecks = async function (email, dateString, work_deg, health_deg, family_deg, relationship_deg, money_deg) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const todayCheckParams = [email, dateString, work_deg, health_deg, family_deg, relationship_deg, money_deg]

        const todayChecksResult = await recordDao.todayChecks(connection, todayCheckParams);
        console.log(todayChecksResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - todayCheck Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.todayRecords = async function (email, dateString, work_doc, health_doc, family_doc, relationship_doc, money_doc) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const todayRecordParams = [work_doc, health_doc, family_doc, relationship_doc, money_doc, email, dateString];

        const todayRecordsResult = await recordDao.todayRecords(connection, todayRecordParams);
        console.log(todayRecordsResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - todayRecord Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
