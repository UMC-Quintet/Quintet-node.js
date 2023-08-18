async function findUserBySnsId(connection, snsId, provider) {
    const findKakaoUserQuery = `SELECT id, username, provider FROM user WHERE snsId = ? and provider = ?;`;
    const kakaoUserRow = await connection.query(findKakaoUserQuery, [snsId, provider]);
    return kakaoUserRow[0];
}

async function insertNewUser(connection, newUserParams) {
    const insertNewUserQuery = `insert into user (username, email, provider, refreshToken, snsId) values (?, ?, ?, ?, ?);`;
    return await connection.query(insertNewUserQuery, newUserParams);
}

async function findUserById(connection, id) {
    const findUserQuery = `SELECT id, username, provider FROM user WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,id);
    return weeklySumRow[0];
}

async function updateUserName(connection, user_id, username) {
    const findUserQuery = `UPDATE user SET username = ? WHERE id = ?;`;
    const weeklySumRow = await connection.query(findUserQuery,[username, user_id]);
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

module.exports = {
    findUserBySnsId,
    insertNewUser,
    findUserById,
    updateUserName,
    deleteUserData,
    updateRefreshToken,
    findSnsId,
};