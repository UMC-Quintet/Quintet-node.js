const staticProvider = require("../provider/staticProvider");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");

/*
exports.guideApi = async function (req, res) {
};
*/

exports.getWeeklyStatic = async function (req, res) {
    const {user_id, startDate, endDate} = req.query;

    const weeklySumResult = await staticProvider.weeklySum(user_id, startDate, endDate);

    const maxVals = findAllMaxKeys(weeklySumResult[0]);
    const maxValList = maxVals.map((key) => keyText[key]);

    const result = degToPer(weeklySumResult[0]);
    const weeklyStaticResult = {
        work_per: result.work_per,
        health_per: result.health_per,
        family_per: result.family_per,
        relationship_per: result.relationship_per,
        money_per: result.money_per,
        maxVals: maxValList
    };

    return res.send(response(baseResponse.SUCCESS, weeklyStaticResult));
};

exports.getMonthlyStatic = async function (req, res) {
    const {user_id, year, month} = req.query;

    const monthlySumResult = await staticProvider.monthlySum(user_id, year, month);

    const maxVals = findAllMaxKeys(monthlySumResult[0]);
    const maxValList = maxVals.map((key) => keyText[key]);

    const result = degToPer(monthlySumResult[0]);
    const monthlyStaticResult = {
        work_per: result.work_per,
        health_per: result.health_per,
        family_per: result.family_per,
        relationship_per: result.relationship_per,
        money_per: result.money_per,
        maxVals: maxValList
    };

    return res.send(response(baseResponse.SUCCESS, monthlyStaticResult));
};

exports.getAnnualStatic = async function (req, res) {
    const {user_id, year} = req.query;

    const annualSumResult = await staticProvider.annualSum(user_id, year);

    const maxVals = findAllMaxKeys(annualSumResult[0]);
    const maxValList = maxVals.map((key) => keyText[key]);

    const result = degToPer(annualSumResult[0]);
    const annualStaticResult = {
        work_per: result.work_per,
        health_per: result.health_per,
        family_per: result.family_per,
        relationship_per: result.relationship_per,
        money_per: result.money_per,
        maxVals: maxValList
    };

    return res.send(response(baseResponse.SUCCESS, annualStaticResult));
};

const keyText = {
    work_deg: '일',
    health_deg: '건강',
    family_deg: '가족',
    relationship_deg: '관계',
    money_deg: '자산'
};
const findAllMaxKeys = (obj) => {
    let maxKeys = [];
    let maxValue = Number.MIN_SAFE_INTEGER;

    for (const key in obj) {
        const value = Number(obj[key]);
        if (!isNaN(value)) {
            if (value > maxValue) {
                maxValue = value;
                maxKeys = [key]; // 새로운 최댓값을 찾았을 때 배열 초기화
            } else if (value === maxValue) {
                maxKeys.push(key); // 기존 최댓값과 같은 값이라면 배열에 추가
            }
        }
    }

    return maxKeys;
};
const degToPer = (obj) => {
    const work_deg = Number(obj.work_deg);
    const health_deg = Number(obj.health_deg);
    const family_deg = Number(obj.family_deg);
    const relationship_deg = Number(obj.relationship_deg);
    const money_deg = Number(obj.money_deg);
    const total_deg = work_deg + health_deg + family_deg + relationship_deg + money_deg;

    const work_per = calculatePercent(work_deg, total_deg);
    const health_per = calculatePercent(health_deg, total_deg);
    const family_per = calculatePercent(family_deg, total_deg);
    const relationship_per = calculatePercent(relationship_deg, total_deg);
    const money_per = calculatePercent(money_deg, total_deg);

    return { work_per: work_per,
            health_per: health_per,
            family_per: family_per,
            relationship_per: relationship_per,
            money_per: money_per};
};

const calculatePercent = (element_deg, total_deg) => {
    return (element_deg / total_deg * 100).toFixed(1);
};