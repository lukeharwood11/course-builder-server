const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getAsyncConnection } = require('./databaseController')
const debug = require('debug')('authentication')
const Error = require('../data/errors');
require('dotenv').config()

const handleRefreshToken = async (req, res) => {
    // check to see if the request contains a cookie
    const cookie = req.cookie
    if (!cookie?.jwt) return res.sendStatus(401)
    try {
        // start connection to db
        const connection = await getAsyncConnection()
        try {
            // check to see if the refresh token is in the database with the correct user
            let query = 'SELECT * from activeusers where refreshtoken = ?'
            let [rows, fields] = await connection.execute(query, [cookie.jwt])
            if (rows.length === 0) throw new Error.HttpError("Refresh token does not exist in the database.", 403)
            const userRow = rows[0]
            // verify the jwt and verify that the ids of the found user matches
            jwt.verify(cookie.jwt, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err || decoded.user.id !== userRow.userId) throw new Error.HttpError(err.message, 403)
                const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
                res.json( { accessToken })
            })
        } finally {
            // close the connection when we're done with it
            connection.end()
        }

    } catch(err) {
        if (err instanceof Error.HttpError) return res.status(err.code).json({ message: err.message })
        return res.status(500).json({ message: err.message })
    }
}

module.exports = handleRefreshToken