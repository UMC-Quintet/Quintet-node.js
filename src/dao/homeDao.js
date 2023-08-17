//homeDao.js
//해당 주 퀸텟 기록을 배열로 반환
async function selectQuintet(connection) {
    const selectQuintetQuery = `
                SELECT user_id, date, work_deg, health_deg, 
                family_deg, relationship_deg, money_deg
                FROM document;`;
    const [QuintetRows] = await connection.query(selectQuintetQuery);
    return QuintetRows;
}

module.exports = {
    selectQuintet
};