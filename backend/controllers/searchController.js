const { poolConnection } = require('./databaseController')

const handleQuery = async (req, res) => {
    const { input } = req.body
    if (input === undefined) return res.status(400).json({ message: "Missing input text for search."})
    const inputText = `%${input}%`
    const queryParams = [inputText, inputText]
    const query = 'SELECT * FROM course WHERE course_code LIKE ? or name LIKE ? AND published = true;'
    try {
        const [rows, fields] = await poolConnection().execute(query, queryParams)
        res.status(200).json({ results: rows })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
    res.json({})
}

module.exports = { handleQuery }