const mysql = require("mysql2");
require("dotenv").config();

const HOST = "localhost"
const USER = "root"
const DATABASE = 'CourseWright'

// mysql2 documentation: https://www.npmjs.com/package/mysql2
const pool = mysql.createPool({host: HOST, user: USER, database: DATABASE, password: process.env.DB_PASSWORD, connectionLimit: 30});

const poolConnection = () => {
    return pool.promise();
}

module.exports = { poolConnection };
