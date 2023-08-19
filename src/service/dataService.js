//dataService.js

const { pool } = require("../../../config/database");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const dataDao = require("./dataDao");
//const {connect} = require("http2");
const dotenv = require('dotenv');

dotenv.config()

exports.data = async function (user_id, userLocalData) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const localDataParams = [user_id, userLocalData];
        const localDataTransmission = await dataDao.localData(connection, localDataParams);
        console.log(localDataTransmission);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        console.log(`App - data transmission Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};