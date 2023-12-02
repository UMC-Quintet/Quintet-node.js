async function findUserBySnsId(connection, snsId, provider) {
    const findUserQuery = `SELECT id, nickname, email, provider FROM user WHERE snsId = ? and provider = ?;`;
    const userRow = await connection.query(findUserQuery, [snsId, provider]);
    return userRow[0];
}

async function insertNewUser(connection, newUserParams) {
    const insertNewUserQuery = `insert into user (name, nickname, email, provider, refreshToken, snsId) values (?, ?, ?, ?, ?, ?);`;
    return await connection.query(insertNewUserQuery, newUserParams);
}

async function findUserById(connection, id) {
    const findUserQuery = `SELECT id, nickname, email, provider FROM user WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,id);
    return weeklySumRow[0];
}

async function updateUserName(connection, user_id, nickname) {
    const findUserQuery = `UPDATE user SET nickname = ? WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,[nickname, user_id]);
    return weeklySumRow[0];
}

async function deleteUserData(connection, user_id) {
    const delDocumentQuery = `DELETE from document WHERE user_id = ?;`;
    const delUserQuery = `DELETE from user WHERE id = ?;`;

    try{
        await connection.query(delDocumentQuery, user_id);
        const deleteUserResult = await connection.query(delUserQuery, user_id);
        return deleteUserResult[0];
    } catch (err) {
        console.log(err);
    }
    const delUserResultRow = await connection.query(delDocumentQuery, [user_id, user_id]);
    return delUserResultRow[0];
}

async function findSnsId(connection, user_id) {
    const delDocumentQuery = `SELECT snsId FROM user WHERE id = ?;`;
    const weeklySumRow = await connection.query(delDocumentQuery, user_id);
    return weeklySumRow[0];
}

async function updateRefreshToken(connection, user_id, refreshToken) {
    const findUserQuery = `UPDATE user SET refreshToken = ? WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,[refreshToken, user_id]);
    return weeklySumRow[0];
}

async function insertLocalData(connection, dataParams) {
    const localDataQuery = `insert into document (user_id, date, work_deg, work_doc, health_deg, health_doc, family_deg, family_doc, relationship_deg, relationship_doc, money_deg, money_doc)
                            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    return await connection.query(localDataQuery, dataParams);
}

module.exports = {
    findUserBySnsId,
    insertNewUser,
    findUserById,
    updateUserName,
    deleteUserData,
    updateRefreshToken,
    findSnsId,
    insertLocalData
};