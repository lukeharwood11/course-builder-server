const debug = require('debug')('courses')
const { poolConnection } = require('./databaseController')
const { v4:uuid } = require('uuid')
const { schema } = require('../models/course')
const Error = require('../data/errors')

const cleanTags = (rows) => {
     return rows.map((r) => {
        return {
            ...r,
            tags: r.tags.filter(t => t !== null).map(t => {
                return {
                    value: t, 
                    label: t
                }
            })
        }
     })
}

/**
 * Return all courses that a user is a part of
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const handleGetCourses = async (req, res) => {
    debug(`UserId of Request: ${req.user.id}`)
    const query = "SELECT e.role as role, c.id as id, pc.course_id as pcId, c.visibility as visibility, pc.active as active, c.affiliation as affiliation, c.subject as subject, c.course_code as code, c.license as license, c.name as name, c.date_created as dateCreated, c.last_modified as lastModified, JSON_ARRAYAGG(ct.tag_name) as tags FROM account a INNER JOIN enrollment e on a.id = e.account_id INNER JOIN private_course pc on e.private_course_id = pc.id INNER JOIN course c on pc.course_id = c.id LEFT JOIN course_tag ct on c.id = ct.course_id WHERE a.id = ? GROUP BY c.id;"
    const params = [req.user.id]
    try {
        const [rows, fields] = await poolConnection().execute(query, params)
        return res.json({ courses: cleanTags(rows) })
    } catch (err) {
        debug("An error occurred.")
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
};

const handleGetSingleCourse = async (req, res) => {
    const course = req.params.course
    return res.json({})
}

/**
 * If there are multiple tags, ensure we only need one query
 */
const createCourseTagQuery = (tags, courseId) => {
    const size = tags.length
    let query = `INSERT INTO course_tag (course_id, tag_name) VALUES ('${courseId}', ?)`
    for (let i = 1; i < size; ++i) {
        query += `, ('${courseId}', ?)`
    }
    query += ';'
    return tags.length == 0 ? undefined : query
}

const handleCreateCourse = async (req, res) => {
    debug(`UserId of Request: ${req.user.id}`)
    // validate the request
    const { error, value } = schema.validate(req.body)
    if (error) {
        console.log(error)
        return res.status(400).json({ message: error.message });
    }

    const insertIntoCourse = "INSERT INTO course (id, `name`, `course_code`, `subject`, creator) VALUES (?, ?, ?, ?, ?);"
    const insertIntoPrivateCourse = "INSERT INTO private_course (id, color, course_id) VALUES (?, NULL, ?);"
    const insertIntoEnrollment = "INSERT INTO enrollment (account_id, private_course_id, `role`) VALUES (?, ?, 1010);"
    const accountId = req.user.id
    const params = []
    try {
        const courseId = uuid()
        const courseParams = [courseId, value.name, value.code, value.subject, accountId]
        const [courseRows, courseFields] = await poolConnection().execute(insertIntoCourse, courseParams)
        const privateCourseId = uuid()
        const privateCourseParams = [privateCourseId, courseId]
        const [pCourseRows, pCourseFields] = await poolConnection().execute(insertIntoPrivateCourse, privateCourseParams)
        const enrollmentParams = [accountId, privateCourseId]
        const [enrollmentRows, enrollmentFields] = await poolConnection().execute(insertIntoEnrollment, enrollmentParams)

        const insertIntoTags = createCourseTagQuery(value.tags, courseId)
        if (insertIntoTags) {
            const [tagRows, tagFields] = await poolConnection().execute(insertIntoTags, value.tags)
        }
        // return the courseId and te privateCourseId
        return res.status(201).json({ privateCourseId, courseId })
    } catch (err) {
        console.log(err)
        debug("An error occurred.")
        return res.status(500).json({ message: err.message })
    }
}

const handleUpdateCourse = async (req, res) => {
    const courseId = req.params.course
    debug(`UserId of Request: ${req.user.id}`)
    // validate the request
    const { error, value } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message });
    const userHasPermissionQuery = "SELECT * FROM enrollment e, course c, private_course pc, account a WHERE a.id = ? and c.id = ? and a.id = e.account_id and pc.id = e.private_course_id and c.id = pc.course_id and e.role = 1010;"
    const updateCourseQuery = "UPDATE course SET name = ?, course_code = ?, subject = ? WHERE id = ?;"
    const deleteCourseTagsForUpdate = "DELETE FROM course_tag WHERE course_id = ?;"
    const accountId = req.user.id
    const params = []
    try {
        const permissionParams = [accountId, courseId]
        const [permissionRows, permissionFields] = await poolConnection().execute(userHasPermissionQuery, permissionParams)
        // should return a single row if the user has permissions to edit
        if (permissionRows.length === 0) return res.status(401).json({ message: "Account does not have permissions to edit course."})
        
        const updateCourseParams = [value.name, value.code, value.subject, courseId]
        const [courseRows, courseFields] = await poolConnection().execute(updateCourseQuery, updateCourseParams)
        const [deleteTagRows, deleteTagFields] = await poolConnection().execute(deleteCourseTagsForUpdate, [courseId])
        const insertIntoTags = createCourseTagQuery(value.tags, courseId)
        if (insertIntoTags) {
            const [tagRows, tagFields] = await poolConnection().execute(insertIntoTags, value.tags)
        }
        // return the courseId and privateCourseId
        return res.sendStatus(204)
    } catch (err) {
        debug("An error occurred.")
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handleGetCourses, handleCreateCourse, handleGetSingleCourse, handleUpdateCourse }