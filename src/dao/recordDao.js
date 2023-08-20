async function todayChecks(connection, todayCheckParams) {
    const todayChecksQuery = `insert into document (user_id, date, work_deg, health_deg, family_deg, relationship_deg, money_deg)
                              values (?, ?, ?, ?, ?, ?, ?);`;
    return await connection.query(todayChecksQuery, todayCheckParams);
}

async function todayRecords(connection, todayRecordParams) {
    const todayRecordsQuery = `update document set work_doc = ?, health_doc = ?, family_doc = ?, relationship_doc = ?, money_doc = ?
                                where user_id = ? and date = ?;`;
    return await connection.query(todayRecordsQuery, todayRecordParams);
}

async function selectRecordsByDate(connection, user_id, year, month) {
    const selectRecordsQuery = `select * from document where user_id = ? and year(date) and month(date);`;
    const selectRecordsResult = await connection.query(selectRecordsQuery, [user_id, year, month]);
    return selectRecordsResult[0];
}

async function selectRecordsByElement(connection, user_id, year, month, element) {
    let selectRecordsQuery = ``
    if (element === "일"){
        selectRecordsQuery = `select id, date, work_deg, work_doc from document where user_id = ? and year(date) = ? and month(date) = ?;`;
    } else if (element === "건강") {
        selectRecordsQuery = `select id, date, health_deg, health_doc from document where user_id = ? and year(date) = ? and month(date) = ?;`;
    } else if (element === "가족") {
        selectRecordsQuery = `select id, date, family_deg, family_doc from document where user_id = ? and year(date) = ? and month(date) = ?;`;
    } else if (element === "관계") {
        selectRecordsQuery = `select id, date, relationship_deg, relationship_doc from document where user_id = ? and year(date) = ? and month(date) = ?;`;
    } else if (element === "자산") {
        selectRecordsQuery = `select id, date, money_deg, money_doc from document where user_id = ? and year(date) = ? and month(date) = ?;`;
    }

    const selectRecordsResult = await connection.query(selectRecordsQuery, [user_id, year, month]);
    return selectRecordsResult[0];
}

async function selectDuplicateData(connection, user_id, date) {
    const selectRecordsQuery = `select * from document where user_id = ? and date = ?;`;
    const selectRecordsResult = await connection.query(selectRecordsQuery, [user_id, date]);
    return selectRecordsResult[0];
}

module.exports = {
    todayChecks,
    todayRecords,
    selectRecordsByDate,
    selectRecordsByElement,
    selectDuplicateData
};