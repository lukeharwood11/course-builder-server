const bcrypt = require("bcrypt");
const debug = require("debug")("register");
const { poolConnection } = require("./databaseController");
const { schema } = require("../models/account");
const Error = require("../data/errors");
const emailValidator = require("email-validator");
const { v4: uuid } = require("uuid");

const handleNewAccount = async (req, res) => {
    debug(req.body);
    const { error, value } = schema.validate(req.body);
    debug(error);
    // validate the new user
    if (error) return res.status(400).json({ message: error.message });
    // TODO: find a better way to validate the email address
    if (!emailValidator.validate(value.email))
        return res.status(400).json({ message: "Invalid email provided." });
    try {
        // check to see if the email already exists in the database
        let query = "SELECT * FROM account WHERE email = ?;";
        let [results, fields] = await poolConnection().execute(query, [
            value.email,
        ]);
        debug(results);
        if (results.length !== 0) throw new Error.HttpError("Email already exists.", 409);
        // attempt to hash the password
        const hashedPassword = await bcrypt.hash(value.password, 10);
        query =
            "INSERT INTO account (first_name, last_name, email, password, type, id) VALUES (?, ?, ?, ?, ?, ?);";
        const { firstName, lastName, email, type } = value;
        const vars = [firstName, lastName, email, hashedPassword, type, uuid()];
        [results, fields] = await poolConnection().execute(query, vars);
        debug(results);
        return res.sendStatus(201);
    } catch (err) {
        console.log(err)
        if (err instanceof Error.HttpError)
            return res.status(err.code).json({ message: err.message });
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser: handleNewAccount };
