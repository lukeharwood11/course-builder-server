const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')

router.route('/:course')
    .get(courseController.handleGetSingleCourse)
    .put(courseController.handleUpdateCourse)


module.exports = router