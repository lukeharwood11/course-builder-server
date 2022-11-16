const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

router.route("/")
    .get(accountController.handleGetAccount)
    .post(accountController.handleNewAccount)
    .put(accountController.handleUpdateAccount)
    .delete(accountController.handleDeleteAccount)

module.exports = router;