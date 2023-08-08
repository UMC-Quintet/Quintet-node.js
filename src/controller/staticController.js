const staticProvider = require("../provider/staticProvider");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");

/*
exports.guideApi = async function (req, res) {
};
*/

exports.getWeeklyStatic = async function (req, res) {
    const {user_id, startDate, endDate} = req.query;

    const weeklyStaticResult = await staticProvider.weeklySum(user_id, startDate, endDate);

    return res.send(response(baseResponse.SUCCESS, weeklyStaticResult));
};

exports.getMonthlyStatic = async function (req, res) {
    const {user_id, year, month} = req.query;

    const monthlyStaticResult = await staticProvider.monthlySum(user_id, year, month);

    return res.send(response(baseResponse.SUCCESS, monthlyStaticResult));
};

exports.getAnnualStatic = async function (req, res) {
    const {user_id, year} = req.query;

    const annualStaticResult = await staticProvider.annualSum(user_id, year);

    return res.send(response(baseResponse.SUCCESS, annualStaticResult));
};