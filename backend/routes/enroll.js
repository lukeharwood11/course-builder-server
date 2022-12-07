const express = require('express')
const router = express.Router()
const enrollmentController = require('../controllers/enrollmentController')

router.route('/create')
    .post(enrollmentController.handleCreateCourseSection)

router.route('/')
    .post(enrollmentController.handleEnrollment)

module.exports = router