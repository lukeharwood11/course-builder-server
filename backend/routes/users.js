const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.route("/")
    .get(userController.handleGetUser)
    .post(userController.handleNewUser)
    .put(userController.handleUpdateUser)
    .delete(userController.handleDeleteUser)


module.exports = router;