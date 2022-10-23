const bcrypt = require("bcrypt");
const debug = require("debug")("register");
const { getAsyncConnection } = require("./databaseController");
const { schema } = require("../models/users/users");
const Error = require("../data/errors");
const emailValidator = require("email-validator");
const { v4: uuid } = require("uuid");

const handleNewUser = async (req, res) => {
    debug(req.body);
    const { error, value } = schema.validate(req.body);
    debug(error);
    // validate the new user
    if (error) return res.status(403).json({ message: error.message });
    // TODO: find a better way to validate the email address
    if (!emailValidator.validate(value.email))
        return res.status(403).json({ message: "Invalid email provided." });
    try {
        const connection = await getAsyncConnection();

        try {
            // check to see if the email already exists in the database
            let query = "select * from users where email = ?;";
            let [results, fields] = await connection.execute(query, [
                value.email,
            ]);
            debug(results);
            if (results.length !== 0)
                throw new Error.HttpError("Email already exists.", 409);

            // attempt to hash the password
            const hashedpassword = await bcrypt.hash(value.password, 10);
            query =
                "INSERT INTO users (firstName, lastName, email, password, type, id) VALUES (?, ?, ?, ?, ?, UUID());";
            const { firstName, lastName, email, type } = value;
            const vars = [firstName, lastName, email, hashedpassword, type];
            [results, fields] = await connection.execute(query, vars);
            debug(results);
            return res.sendStatus(201);
        } finally {
            connection.end();
        }
    } catch (err) {
        if (err instanceof Error.HttpError)
            return res.status(err.code).json({ message: err.message });
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
