const mysql = require("mysql2/promise");
require("dotenv").config();

const HOST = "localhost"
const USER = "root"
const DATABASE = 'course_builder'

// mysql2 documentation: https://www.npmjs.com/package/mysql2

/**
 * Prepared statement for mysql database
 * @param {string} query a string with '?' inserted for variables
 * @param {any} params variables to replace the '?'
 * @param {function(rows, fields)} callback callback function
 */
const executePreparedQuery = async (query, params, callback) => {
    const connection = await mysql.createConnection({host: HOST, user: USER, database: DATABASE, password: process.env.DB_PASSWORD});
    const [rows, fields] = await connection.execute(query, params);
    callback(rows, fields)
    await connection.end();
}

const getAsyncConnection = async () => {
    const connection = await mysql.createConnection({host: HOST, user: USER, database: DATABASE, password: process.env.DB_PASSWORD});
    return connection;
}

/**
 * Normal mysql query without prepared statement
 * @param {string} query mysql query
 * @param {function(rows, fields)} callback callback function
 */
const queryDatabase = async (query, callback) => {
    const connection = await mysql.createConnection({host: HOST, user: USER, database: DATABASE, password: process.env.DB_PASSWORD});
    const [rows, fields] = await connection.query(query)
    callback(rows, fields)
    await connection.end();
}

module.exports = { getAsyncConnection, queryDatabase, executePreparedQuery };
