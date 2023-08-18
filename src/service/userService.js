const {pool} = require("../../config/database");
const userDao = require("../dao/userDao");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const dotenv = require('dotenv');

dotenv.config()

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.insertNewUser = async function (username, email, provider, refreshToken, snsId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const newUserParams = [username, email, provider, refreshToken, snsId]
        const insertNewUserResult = await userDao.insertNewUser(connection, newUserParams);
        console.log(insertNewUserResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - insertNewUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateUserName = async function (user_id, username) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const updateUserNameResult = await userDao.updateUserName(connection, user_id, username);
        console.log(updateUserNameResult);
        connection.release();
        const result = { user_id : user_id, newUserName : username }

        return response(baseResponse.SUCCESS, result);
    } catch (err) {
        console.log(`App - updateUserName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteUserData = async function (user_id) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const deleteUserDataResult = await userDao.deleteUserData(connection, user_id);
        console.log(deleteUserDataResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - deleteUserData Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateRefreshToken = async function (user_id, refreshToken) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const updateRefreshResult = await userDao.updateRefreshToken(connection, user_id, refreshToken);
        console.log(updateRefreshResult);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - deleteUserData Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};