const jwt = require('jsonwebtoken')
const { poolConnection } = require('./databaseController')
const debug = require('debug')('authentication')
const Error = require('../data/errors');
require('dotenv').config()

const handleRefreshToken = async (req, res) => {
    // check to see if the request contains a cookie
    const cookies = req.cookies
    debug("Attempting to refresh the token!")
    debug(cookies)
    if (!cookies?.jwt) return res.sendStatus(401)
    try {
        // check to see if the refresh token is in the database with the correct user
        let query = 'SELECT * from active_user where refreshtoken = ?'
        let [rows, fields] = await poolConnection().execute(query, [cookies.jwt])
        if (rows.length === 0) throw new Error.HttpError("Refresh token does not exist in the database.", 403)
        const userRow = rows[0]
        // verify the jwt and verify that the ids of the found user matches
        jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.user.id !== userRow.userId) throw new Error.HttpError(err.message, 403)
            const { user } = decoded
            const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
            console.log(accessToken)
            debug("Success! Access token returned.")
            res.status(200).json( { user, accessToken })
        })
    } catch(err) {
        if (err instanceof Error.HttpError) return res.status(err.code).json({ message: err.message })
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handleRefreshToken }