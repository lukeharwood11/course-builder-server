const { urlencoded } = require("express");
const express = require("express")
const verifyJwt = require('./middleware/verifyJwt')
const debug = require('debug')('server')
const request = require('debug')('request')
const { logger } = require('./middleware/logEvents')
const path  = require("path")
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsConfigurations')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
require('dotenv').config()

const app = express()
// set middleware
app.use(logger)

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(urlencoded( { extended: false }))
app.use(express.json())

// unprotected routes
app.use('/api/create-account', require('./routes/createAccount'))
app.use('/api/refresh', require('./routes/refresh'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/logout', require('./routes/logout'))

// protected routes
app.use(verifyJwt)
app.use('/api/account', require('./routes/account'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/course', require('./routes/course'))
app.use('/api/search', require('./routes/search'))
app.use(errorHandler)

PORT = process.env.PORT | 8080

app.listen(PORT, (err) => {
    if (err) console.log("There was an error Launching the server...", err)
    else debug(`Listening on port ${PORT}`)
});