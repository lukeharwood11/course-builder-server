const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const { username, pwd } = req.body
    if (!username || !pwd) return res.status(401).json({ message: "Must provide both a username and password"})
    // TODO: check to see if the user is in the database
    //       if so, grab and validate the password, otherwise return 401
    
    // if the username and password match
    // using -> await bcrypt.compare(pwd, {password})
    // then send a jwt token along with a refresh token
}