const { pool } = require("../../config/database");
const recordDao = require("../dao/recordDao");

exports.getRecordsByDate = async function (user_id, year, month) {
    const connection = await pool.getConnection(async (conn) => conn);
    const recordsListResult = await recordDao.selectRecordsByDate(connection, user_id, year, month);
    connection.release();

    return {
        user_id: user_id,
        year: year,
        month: month,
        records: recordsListResult[0]
    };
}

exports.getRecordsByElement = async function (user_id, year, month, element) {
    const connection = await pool.getConnection(async (conn) => conn);
    const recordsListResult = await recordDao.selectRecordsByElement(connection, user_id, year, month, element);
    connection.release();

    return {
        user_id: user_id,
        year: year,
        month: month,
        element: element,
        records: recordsListResult[0]
    };
}