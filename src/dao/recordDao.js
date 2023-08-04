async function todayChecks(connection, todayCheckParams) {
    const todayChecksQuery = `insert into quintets (user_email, quintet_dt, work_deg, health_deg, family_deg, relationship_deg, money_deg)
                              values (?, ?, ?, ?, ?, ?, ?);`;
    return await connection.query(todayChecksQuery, todayCheckParams);
}

async function todayRecords(connection, todayRecordParams) {
    const todayRecordsQuery = `update quintets set work_doc = ?, health_doc = ?, family_doc = ?, relationship_doc = ?, money_doc = ?
                                where user_email = ? and quintet_dt = ?;`;
    return await connection.query(todayRecordsQuery, todayRecordParams);
}

module.exports = {
    todayChecks,
    todayRecords
};