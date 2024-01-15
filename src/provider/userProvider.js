const { pool } = require("../../config/database");
const userDao = require("../dao/userDao");
const customeJWT = require("../../config/jwtModules");
const dotenv = require("dotenv");

dotenv.config();

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

exports.getUserNicknameById = async function (id) {

    const connection = await pool.getConnection(async (conn) => conn);
    const findUserResult = await userDao.findUserNicknameById(connection, id);
    connection.release();

    return findUserResult[0];
};

exports.getSnsID = async function (user_id) { //카카오 로그아웃에서 이용

    const connection = await pool.getConnection(async (conn) => conn);
    const findUserResult = await userDao.findSnsId(connection, user_id);
    connection.release();

    return findUserResult[0];
};

exports.createAccessToken = async function (user) { //토큰 생성하는 부분
    return await customeJWT.accessSign({
            id: user.id,
            username: user.username,
            email: user.email,
            provider: user.provider
        },
        process.env.JWT_SECRET,
        {expiresIn: '30m'}
    );
};