const { pool } = require("../../../config/database");

const homeDao = require("./homeDao");

exports.retrieveQuintetCheck = async function (userId, date) {
  const connection = await pool.getConnection(async (conn) => conn);
  const quintetCheckResult = await homeDao.selectQuintet(connection, userId, date);
  connection.release();
  return quintetCheckResult;
}