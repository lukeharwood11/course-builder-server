const jwt = require('jsonwebtoken')
const debug = require('debug')('jwt-verify')
require('dotenv').config()

/**
 * Parse the accessToken from the authentication header
 * Note: Assumes a non-null header is passed through
 * @param {string} authHeader the result from the authentication header
 * @returns null or the parsed token
 */
const getToken = (authHeader) => {
    const regex = /[Bb]earer\s(\S*)/
    const result = regex.exec(authHeader)
    return result && result[1]
}

/**
 * Run test jwt.rest
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers["Authorization"]
    if (!authHeader) return res.sendStatus(401)
    const token = getToken(authHeader)
    if (!token) return res.sendStatus(401)
    debug(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403)
        }
        debug(decoded.user)
        req.user = decoded.user
        next()
    })
}

module.exports = verifyJwt