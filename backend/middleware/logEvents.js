const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const debug = require('debug')('logger')

const logEvents = async (message, logName) => {
    const date = new Date()
    const dateTime = `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const logItem = `${dateTime} - ${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
    } catch (err) {
        debug(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method} \t ${req.headers.origin} \t ${req.url}`,'requests.txt')
    next()
}

module.exports = { logEvents, logger }