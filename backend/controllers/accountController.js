const debug = require('debug')('account')

const handleGetAccount = ((req, res) => {
    debug(`get user`)
    res.status(200).json({ message: "Success!" })
})

const handleNewAccount = ((req, res) => {
    debug('create new user')
    res.status(200).json({ message: "Success!" })
})

const handleUpdateAccount = ((req, res) => {
    debug('update user')
    res.status(200).json({ message: "Success!" })
})

const handleDeleteAccount = ((req, res) => {
    debug('delete user')
    res.status(200).json({ message: "Success!" })
})

module.exports = { handleGetAccount, handleNewAccount, handleUpdateAccount, handleDeleteAccount }