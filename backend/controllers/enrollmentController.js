const { poolConnection } = require('./databaseController')
const { v4:uuid } = require('uuid')



const databaseEnroll = async (accountId, privateCourseId, role, status) => {
    const query = "INSERT INTO enrollment (account_id, private_course_id, role, status) VALUES (?, ?, ?, ?);"
    return await poolConnection().execute(query, [accountId, privateCourseId, role, status])
}

const createPrivateCourse = async (courseId) => {
    const pcId = uuid()
    const query = "INSERT INTO private_course (id, course_id, color) VALUES (?, ?, 'none');"
    await poolConnection().execute(query, [pcId, courseId])
    return pcId
}

const canCreatePrivateCourse = async (courseId) => {
    const query = "SELECT * FROM course where id = ? and published = true;"
    const [r, f] = await poolConnection().execute(query, [courseId])
    return r.length > 0
}

const hasPermissions = async (user, account, pcId, requestedRole) => {
    const permissionsQuery = "SELECT * FROM enrollment WHERE private_course_id = ? AND account_id = ? AND (role = 21 OR role = 20);"
    const linkQuery = "SELECT * FROM private_course where id = ? and enroll_using_link = true;";
    if (user === account) {
        if (requestedRole !== 40) return false
        return (await poolConnection().execute(linkQuery, [pcId]))[0].length > 0
    } else {
        return (await poolConnection().execute(permissionsQuery, [pcId, user]))[0].length > 0
    }
    // user has permissions if they are the same as the account and link is true
    
    // or
    // user has permissions if they are a 2000/2001
}

const handleCreateCourseSection = async (req, res) => {
    const user = req.user.id
    const { courseId } = req.body
    if (courseId === undefined) return res.status(400).json({ message: "Missing courseId" })
    try {
        if (!await canCreatePrivateCourse(courseId)) return res.sendStatus(401)
        const pcId = await createPrivateCourse(courseId)
        await databaseEnroll(user, pcId, 20, 'confirmed')
        res.status(201).json({ pcId })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}

const handleEnrollment = async (req, res) => {
    const user = req.user.id
    const { account, pcId } = req.body
    try {
    // verify that the user has the permissions to enroll in the course
        if (!await hasPermissions(user, account.id, pcId, account.role)) {
            return res.sendStatus(401)
        }
        const accountId = account.id ? account.id : uuid()
        if (!account.id) {
            const createPseudoAccountQuery = "INSERT INTO account (email, id, first_name, last_name, type, temp_account) VALUES (?, ?, ?, ?, 'student', TRUE);"
            const accountQueryParams = [account.email, accountId, account.firstName, account.lastName]
            // account role should always be 40
            account.role = 40
            await poolConnection().execute(createPseudoAccountQuery, accountQueryParams)
        }
        await databaseEnroll(accountId, pcId, account.role, 'unconfirmed')
        return res.status(201).json({ id: accountId })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err })
    }

}

const handleTemporaryUserEnrollment = async (req, res) => {
    const user = req.user.id
    const { firstName, lastName } = req.body
    try {

    } catch (err) {
        return res.status(500).json({ message: err })
    }
}

module.exports = { handleCreateCourseSection, handleEnrollment }