const debug = require('debug')('error')
const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'error.txt')
    debug(err.stack)
    res.status(500).send(err.message)
}

module.exports = errorHandler