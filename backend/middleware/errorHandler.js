const debug = require('debug')('error')
const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    const message = `${req.method} \t ${req.headers.origin} \t ${req.url}`
    logEvents(`${err.name}: ${err.message} -- ${message}`, 'error.txt')
    debug(err.stack)
    res.status(500).send(err.message)
}

module.exports = errorHandler