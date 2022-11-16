const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { poolConnection } = require('./databaseController')
const debug = require('debug')('authentication')
const Error = require('../data/errors');
require('dotenv').config()

const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Must provide both a username and password."})
    // if the username and password match
    // using -> await bcrypt.compare(password, {password})
    // then send a jwt token along with a refresh token
    try {
        // check to see if the user is in the database
        let query = 'SELECT * FROM account WHERE email = ?'
        let [rows, fields] = await poolConnection().execute(query, [email])
        if (rows.length === 0) throw new Error.HttpError("User does not exist within the database.", 401)
        const userRow = rows[0]
        // verify that the passwords match
        const match = await bcrypt.compare(password, userRow.password)
        if (match) {
            debug("Passwords Match!")
            const user = { firstName: userRow.first_name, lastName: userRow.last_name, id: userRow.id, type: userRow.type, email: userRow.email }
            const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
            const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

            // add the refreshtoken to the database
            query = 'INSERT INTO active_user (userId, refreshToken) VALUES (?, ?) ON DUPLICATE KEY UPDATE refreshToken = ?;'
            const [rows, fields] = await poolConnection().execute(query, [user.id, refreshToken, refreshToken])
            // send the refreshToken as a cookie
            // maxAge is equal to 1 day
            debug(refreshToken)
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            debug("No Error.")
            res.json({ user, accessToken })
        } else {
            debug("Passwords do NOT match.")
            res.status(401).json({ message: "Invalid password." })
        }
    } catch(err) {
        debug("An error occurred.")
        if (err instanceof Error.HttpError) return res.status(err.code).json({ message: err.message })
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handleLogin }