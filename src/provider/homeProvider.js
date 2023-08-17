const { pool } = require("../../config/database");

const homeDao = require("../dao/homeDao");

exports.retrieveQuintetCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const quintetCheckResult = await homeDao.selectQuintet(connection);
  connection.release();
  return quintetCheckResult;
}