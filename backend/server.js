const { urlencoded } = require("express");
const express = require("express")
const verifyJwt = require('./middleware/verifyJwt')
const debug = require('debug')('server')
const request = require('debug')('request')
const path  = require("path")
const cookieParser = require('cookie-parser')

const app = express()
debug('running.')
// set middleware
app.use((req, res, next) => {
    request(`${req.method}- ${req.ip}`)
    next()
})
app.use(cookieParser())
app.use(urlencoded( { extended: false }))
app.use(express.json())

// unprotected routes
app.use('/api/create-account', require('./routes/createAccount'))
app.use('/api/auth', require('./routes/auth'))

// protected routes
app.use(verifyJwt)
app.use('/api/users', require('./routes/users'))

PORT = process.env.PORT | 8080

app.listen(PORT, (err) => {
    if (err) console.log("There was an error Launching the server...", err)
    else debug(`Listening on port ${PORT}`)
});