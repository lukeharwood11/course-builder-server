const express = require("express")
const path  = require("path")

const app = express()

app.use(express.json())
app.use(content)
app.use('/api/users', require('./routes/users'))

PORT = process.env.PORT | 8080

app.listen(PORT, (err) => {
    if (err) console.log("There was an error Launching the server...", err)
    else console.log(`Listening on port ${PORT}.`)
});