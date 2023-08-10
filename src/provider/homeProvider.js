const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const homeDao = require("./homeDao");

exports.retrieveQuintetCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const quintetCheckResult = await homeDao.selectQuintet(connection);
  connection.release();
  return quintetCheckResult;
}