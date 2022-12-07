const { poolConnection } = require('./databaseController')
const { cleanTags } = require('./courseController')

const handleQuery = async (req, res) => {
    const { text } = req.query
    if (text === undefined) {
        console.log(req)
        return res.status(400).json({ message: "Missing input text for search."})
    }
    const inputText = `%${text}%`
    const queryParams = [inputText, inputText, req.user.id]
    const query = "SELECT c.subject as subject, c.course_code as code, c.last_modified as lastModified, c.date_created as dateCreated, a.first_name as firstName, a.last_name as lastName, a.email as email, a.home_page_id as homePageId, c.license as license, c.name as name, c.license as license, c.affiliation as affiliation, c.id as id, c.visibility as visibility, JSON_ARRAYAGG(ct.tag_name) as tags FROM course c INNER JOIN account a on c.creator = a.id LEFT JOIN course_tag ct on c.id = ct.course_id WHERE (c.course_code like ? or c.name like ?) and c.published = true and (c.visibility = 'public' or a.id = ?) GROUP BY c.id;"
    try {
        const [rows, fields] = await poolConnection().execute(query, queryParams)
        return res.status(200).json({ results: cleanTags(rows) })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

const handleSearchUsers = async (req, res) => {
    const { text } = req.query
    if (text === undefined) {
        return res.status(400).json({ message: "Missing input text for search."})
    }
    const inputText = `%${text}%`
    const queryParams = [inputText]
    const query = "SELECT email, id, type, first_name as firstName, last_name as lastName FROM account where email LIKE ?;"
    try {
        const [rows, fields] = await poolConnection().execute(query, queryParams)
        return res.status(200).json({ results: rows })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

module.exports = { handleQuery, handleSearchUsers }