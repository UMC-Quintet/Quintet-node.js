const { pool } = require("../../config/database");

const staticDao = require("../dao/staticDao");

// Provider: Read 비즈니스 로직 처리
/*
exports.guideApi = async function (param) {
};
*/
exports.weeklySum = async function (user_id, startDate, endDate) {
    const connection = await pool.getConnection(async (conn) => conn);
    const weeklySumResult = await staticDao.weeklySum(connection, user_id, startDate, endDate);
    connection.release();

    return weeklySumResult;
}

exports.monthlySum = async function (user_id, year, month) {
    const connection = await pool.getConnection(async (conn) => conn);
    const monthlySumResult = await staticDao.monthlySum(connection, user_id, year, month);
    connection.release();

    return monthlySumResult;
}

exports.annualSum = async function (user_id, year) {
    const connection = await pool.getConnection(async (conn) => conn);
    const annualSumResult = await staticDao.annualSum(connection, user_id, year);
    console.log(annualSumResult);
    connection.release();

    return annualSumResult;
}