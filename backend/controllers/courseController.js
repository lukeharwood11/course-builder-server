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

    const privateCourseQuery = "SELECT 'pc' as type, e.role as role, c.id as id, pc.id as pcId, c.visibility as visibility, c.published as published, pc.active as active, c.affiliation as affiliation, c.subject as subject, c.course_code as code, c.license as license, c.name as name, c.date_created as dateCreated, c.last_modified as lastModified, JSON_ARRAYAGG(ct.tag_name) as tags, enrolled.accounts as accounts FROM account a INNER JOIN enrollment e on a.id = e.account_id INNER JOIN private_course pc on e.private_course_id = pc.id INNER JOIN course c on pc.course_id = c.id LEFT JOIN course_tag ct on c.id = ct.course_id INNER JOIN ( SELECT JSON_ARRAYAGG(JSON_OBJECT( 'firstName', a.first_name, 'lastName', a.last_name, 'email', a.email, 'role', e.role )) as accounts, pc.id as id FROM private_course pc, enrollment e, `account` a WHERE pc.id = e.private_course_id and a.id = e.account_id GROUP BY pc.id ) as enrolled on enrolled.id = pc.id WHERE a.id = ? GROUP BY pc.id;"

    const courseQuery = "SELECT 'c' as type, e.role as role, c.id as id, c.visibility as visibility, c.published as published, c.affiliation as affiliation, c.subject as subject, c.course_code as code, c.license as license, c.name as name, c.date_created as dateCreated, c.last_modified as lastModified, JSON_ARRAYAGG(ct.tag_name) as tags, editing.accounts as accounts FROM account a INNER JOIN course_editor e on a.id = e.account_id INNER JOIN course c on c.id = e.course_id LEFT JOIN course_tag ct on c.id = ct.course_id INNER JOIN ( SELECT JSON_ARRAYAGG(JSON_OBJECT( 'firstName', a.first_name, 'lastName', a.last_name, 'email', a.email, 'role', ce.role )) as accounts, c.id as id FROM course c, course_editor ce, `account` a WHERE c.id = ce.course_id and a.id = ce.account_id GROUP BY c.id ) as editing on editing.id = c.id WHERE a.id = ? GROUP BY c.id;"
    const courseParams = [req.user.id]
    try {
        const [privateCourseRows, privateCourseFields] = await poolConnection().execute (privateCourseQuery, courseParams)
        const [courseRows, courseFields] = await poolConnection().execute(courseQuery, courseParams)
        return res.json({ privateCourses: cleanTags(privateCourseRows), courses: cleanTags(courseRows) })
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

    const insertIntoCourse = "INSERT INTO course (id, creator, `name`, `course_code`, `subject`) VALUES (?, ?, ?, ?, ?);"
    const insertIntoCourseEditors = "INSERT INTO course_editor (course_id, account_id, `role`) VALUES (?, ?, 1010);"
    const accountId = req.user.id
    try {
        const courseId = uuid()
        const courseParams = [courseId, accountId, value.name, value.code, value.subject]
        const [courseRows, courseFields] = await poolConnection().execute(insertIntoCourse, courseParams)
        const courseEditorsParams = [courseId, accountId]
        const [pCourseRows, pCourseFields] = await poolConnection().execute(insertIntoCourseEditors, courseEditorsParams)
        const insertIntoTags = createCourseTagQuery(value.tags, courseId)
        if (insertIntoTags) {
            const [tagRows, tagFields] = await poolConnection().execute(insertIntoTags, value.tags)
        }
        // return the courseId and te privateCourseId
        return res.status(201).json({ courseId })
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
    const userHasPermissionQuery = "SELECT * FROM course_editor ce, course c, `account` a WHERE a.id = ? and c.id = ? and a.id = ce.account_id and c.id = ce.course_id and ce.role = 1010 or ce.role = 1011;"
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

const handlePublishCourse = async (req, res) => {
    const courseId = req.params.course
    const accountId = req.user.id

    const { publish } = req.body
    if (publish === undefined) return res.status(400).json({ message: "Missing publish element." })

    const userHasPermissionQuery = "SELECT * FROM course_editor ce, course c, `account` a WHERE a.id = ? and c.id = ? and a.id = ce.account_id and c.id = ce.course_id and ce.role = 1010 or ce.role = 1011;"
    const updateQuery = "UPDATE course SET published = ? where course.id = ?;"

    try {
        const permissionParams = [accountId, courseId]
        const [permissionRows, permissionFields] = await poolConnection().execute(userHasPermissionQuery, permissionParams)
        const updateParams = [publish, courseId]
        const [updateRows, updateFields] = await poolConnection().execute(updateQuery, updateParams)
        return res.sendStatus(204)
    } catch (err) {
        debug("An error occurred.", err)
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handlePublishCourse, handleGetCourses, handleCreateCourse, handleGetSingleCourse, handleUpdateCourse }