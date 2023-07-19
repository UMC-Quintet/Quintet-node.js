const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config()

const pool = mysql.createPool({
    host: '',
    user: process.env.DB_USERNAME,
    port: '',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = {
    pool: pool
};