const jwt = require('jsonwebtoken')
const debug = require('debug')('jwt-verify')
require('dotenv').config()

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401)
    const token = authHeader.split(' ')[1]
    
    debug(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        debug(decoded.user)
        req.user = decoded.user
        next()
    })
}

module.exports = verifyJwt