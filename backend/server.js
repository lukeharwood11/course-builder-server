const { urlencoded } = require("express");
const express = require("express")
const debug = require('debug')('server')
const request = require('debug')('request')
const path  = require("path")

const app = express()
debug('running.')
// set middleware
app.use((req, res, next) => {
    request(`${req.method}- ${req.ip}`)
    next()
})
app.use(urlencoded( { extended: false }))
app.use(express.json())
app.use('/api/users', require('./routes/users'))
app.use('/api/create-account', require('./routes/createAccount'))

PORT = process.env.PORT | 8080

app.listen(PORT, (err) => {
    if (err) console.log("There was an error Launching the server...", err)
    else debug(`Listening on port ${PORT}`)
});