const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')

router.route('/:course')
    .get(courseController.handleGetSingleCourse)
    .put(courseController.handleUpdateCourse)

router.route('/publish/:course')
    .put(courseController.handlePublishCourse)

module.exports = router