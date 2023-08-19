//dataDao.js

async function localData(connection, user_id, localDataParams) {
    const localDataQuery = `insert into quintets (user_email, quintet_dt, work_deg, health_deg, family_deg, relationship_deg, money_deg)
                              values (?, ?, ?, ?, ?, ?, ?);`;
    return await connection.query(localDataQuery, [user_id, localDataParams]);
}

module.exports = {
    localData
};