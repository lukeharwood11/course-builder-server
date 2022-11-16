const debug = require('debug')('courses')
const { poolConnection } = require('./databaseController')
const { v4:uuid } = require('uuid')
const Error = require('../data/errors')

/**
 * Return all courses that a user is a part of
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const handleGetCourses = async (req, res) => {
    debug(`UserId of Request: ${req.user.id}`)
    const query = "select pc.id as id, c.id as course_id, c.name as name, c.course_code as course_code, c.visibility as visibility, c.license as license, c.subject as subject, pc.color as color, e.role as role from account a, enrollment e, private_course pc, course c where a.id = ? and a.id = e.account_id and e.private_course_id = pc.id and c.id = pc.course_id;"
    const params = [req.user.id]
    try {
        const [rows, fields] = await poolConnection().execute(query, params)
    } catch (err) {
        debug("An error occurred.")
        if (err instanceof Error.HttpError) return res.status(err.code).json({ message: err.message })
        return res.status(500).json({ message: err.message })
    }
    return res.json({
        courses: [{ studentCount: 10, id: uuid(), name: "Computer Science 101", code: "CS-101" }, { studentCount: 6, id: uuid(), name: "Test Course", code: "GS-1023"}, { studentCount: 3, id: uuid(), name: "Computer Science 101", code: "CS-101" }, { studentCount: 10, id: uuid(), name: "Test Course", code: "GS-1023"}, { studentCount: 18, id: uuid(), name: "Computer Science 101", code: "CS-101" }, { studentCount: 10, id: uuid(), name: "Test Course", code: "GS-1023"}],
    });
};

const handleCreateCourse = async (req, res) => {
    debug(`UserId of Request: ${req.user.id}`)
    const query = "insert "
    const params = []
    try {
        const id = uuid()
        const [rows, fields] = await poolConnection().execute(query, params)
        
    } catch (err) {
        debug("An error occurred.")
        if (err instanceof Error.HttpError) return res.status(err.code).json({ message: err.message })
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handleGetCourses, handleCreateCourse }