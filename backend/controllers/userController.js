const debug = require('debug')('user')

const handleGetUser = ((req, res) => {
    debug(`get user`)
    res.status(200).json({ message: "Success!" })
})

const handleNewUser = ((req, res) => {
    debug('create new user')
    res.status(200).json({ message: "Success!" })
})

const handleUpdateUser = ((req, res) => {
    debug('update user')
    res.status(200).json({ message: "Success!" })
})

const handleDeleteUser = ((req, res) => {
    debug('delete user')
    res.status(200).json({ message: "Success!" })
})

module.exports = { handleDeleteUser, handleUpdateUser, handleGetUser, handleNewUser }