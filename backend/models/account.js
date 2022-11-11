const Joi = require('joi')

const accountType = {
    TEACHER: 'teacher', 
    STUDENT: 'student'
}

// must be 8 characters long - can use special characters
const passwordRegex = /^[a-zA-Z0-9!@#*$%^&.,';()/\\-]{8,}$/

const schema = Joi.object({
    firstName: Joi.string()
        .required().trim(),
    
    lastName: Joi.string()
        .required().trim(),

    password: Joi.string()
        // minimum 8 characters one required number
        .pattern(passwordRegex)
        .required(),

    repeatPassword: Joi.ref('password'),

    email: Joi.string().required().trim(),

    type: Joi.string().valid(accountType.TEACHER, accountType.STUDENT).required(),
})

module.exports = {
    accountType, schema
}