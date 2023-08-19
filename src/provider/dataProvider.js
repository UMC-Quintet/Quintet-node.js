// const { pool } = require("../../../config/database");

// const dataDao = require("./dataDao");

// exports.data = async function (user_id) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const localDataTransmission = await dataDao.localData(connection,user_id);
//   connection.release();
//   return localDataTransmission;
// }