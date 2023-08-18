const staticProvider = require("../provider/staticProvider");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
function getWeekRange() {
    const date = new Date();
    const day = date.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const diff = date.getDate() - day + (day === 0 ? -6 : 0); // 해당 주의 첫 날짜
    const startOfWeek = new Date(date.setDate(diff));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // 해당 주의 마지막 날짜

    return { start: startOfWeek, end: endOfWeek };
}

exports.getWeeklyStatic = async function (req, res) {
    //const user_id = req.user.user_id;
    const user_id = req.query.user_id;
    const {startDate, endDate} = getWeekRange();

    const weeklyStaticResult = await staticProvider.weeklySum(user_id, startDate, endDate);

    return res.send(response(baseResponse.SUCCESS, weeklyStaticResult));
};

exports.getMonthlyStatic = async function (req, res) {
    //const user_id = req.user.user_id;
    const {user_id, year, month} = req.query;

    const monthlyStaticResult = await staticProvider.monthlySum(user_id, year, month);

    return res.send(response(baseResponse.SUCCESS, monthlyStaticResult));
};

exports.getAnnualStatic = async function (req, res) {
    const {user_id, year} = req.query;
    //const user_id = req.user.user_id;

    const annualStaticResult = await staticProvider.annualSum(user_id, year);
    return res.send(response(baseResponse.SUCCESS, annualStaticResult));
};