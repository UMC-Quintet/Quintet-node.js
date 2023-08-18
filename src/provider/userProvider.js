const { pool } = require("../../config/database");
const userDao = require("../dao/userDao");

exports.getUserBySnsId = async function (snsId, provider) {

    const connection = await pool.getConnection(async (conn) => conn);
    const findUserResult = await userDao.findUserBySnsId(connection, snsId, provider);
    connection.release();

    return findUserResult[0];
};

exports.getUserById = async function (id) {

    const connection = await pool.getConnection(async (conn) => conn);
    const findUserResult = await userDao.findUserById(connection, id);
    connection.release();

    return findUserResult[0];
};

exports.getSnsID = async function (user_id) {

    const connection = await pool.getConnection(async (conn) => conn);
    const findUserResult = await userDao.findSnsId(connection, user_id);
    connection.release();

    return findUserResult[0];
};