//homeDao.js
//해당 주 퀸텟 기록을 배열로 반환
async function selectQuintet(connection, userId, date) {
    const selectQuintetQuery = `
                SELECT user_id, date, work_deg, health_deg, 
                family_deg, relationship_deg, property_deg
                FROM document`;
    const [QuintetRows] = await connection.query(selectQuintetQuery, [userId, date]);
    return QuintetRows;
}

module.exports = {
    selectQuintet
};