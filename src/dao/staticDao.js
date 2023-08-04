/*
async function guideApi(connection) {
}
*/
async function weeklySum(connection, user_id, startDate, endDate) {
    const weeklySumQuery = `SELECT sum(work_deg) as work_deg, sum(health_deg) as health_deg, sum(family_deg) as family_deg, sum(relationship_deg) as relationship_deg, sum(money_deg) as money_deg
                            FROM document
                            WHERE user_id = ? and quintet_dt between ? and ?;`;
    const weeklySumRow = await connection.query(weeklySumQuery, [user_id, startDate, endDate]);
    return weeklySumRow[0];
}

async function monthlySum(connection, user_id, year, month) {
    const monthlySumQuery = `SELECT sum(work_deg) as work_deg, sum(health_deg) as health_deg, sum(family_deg) as family_deg, sum(relationship_deg) as relationship_deg, sum(money_deg) as money_deg
                            FROM document
                            WHERE user_id = ? and year(quintet_dt) = ? and month(quintet_dt) = ?`;
    const monthlySumRow = await connection.query(monthlySumQuery, [user_id, year, month]);
    return monthlySumRow[0];
}

async function annualSum(connection, user_id, year) {
    const annualSumQuery = `SELECT sum(work_deg) as work_deg, sum(health_deg) as health_deg, sum(family_deg) as family_deg, sum(relationship_deg) as relationship_deg, sum(money_deg) as money_deg
                            FROM document
                            WHERE user_id = ? and year(quintet_dt) = ?;`;
    const annualSumRow = await connection.query(annualSumQuery, [user_id, year]);
    return annualSumRow[0];
}

module.exports = {
    weeklySum,
    monthlySum,
    annualSum
};
