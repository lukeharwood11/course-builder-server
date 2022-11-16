const jwt = require('jsonwebtoken')
const { getAsyncConnection } = require('./databaseController')
const debug = require('debug')('logout')
const Error = require('../data/errors');
require('dotenv').config()

const handleLogout = async (req, res) => {
    // check to see if the request contains a cookie
    const cookies = req.cookies
    debug(cookies)
    if (!cookies?.jwt) return res.sendStatus(204)
    try {
        // delete the entry from the table
        let query = 'DELETE FROM active_user WHERE refreshtoken = ?'
        connection.execute(query, [cookies.jwt])
        // remove the cookie
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.sendStatus(204)
    } catch(err) {
        if (err instanceof Error.HttpError) return res.status(err.code).json({ message: err.message })
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handleLogout }