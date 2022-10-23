const debug = require('debug')('courses')

const handleGetCourses = (req, res) => {
    const userId = req.params.user;
    debug(`UserId requested: ${userId}`)
    debug(`UserId of Request: ${req.user.id}`)
    if (userId !== req.user.id) return res.sendStatus(403)
    debug("Success! Sending json data!")
    // TODO: access the database for all courses under that id
    return res.json({
        courses: [{ name: "Computer Science 101", code: "CS-101" }, { name: "testName", code: "CS-URMOM"}],
    });
};

module.exports = { handleGetCourses }