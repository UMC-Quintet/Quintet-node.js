//homeDao.js
//해당 주 퀸텟 기록을 배열로 반환
async function selectQuintet(connection, userId, startDate, endDate) {
    const selectQuintetQuery = `
                SELECT date, work_deg, health_deg, family_deg, relationship_deg, money_deg
                FROM document
                WHERE user_id = ? and date between ? and ?`;
    return await connection.query(selectQuintetQuery, [userId, startDate, endDate]);
}

module.exports = {
    selectQuintet
};