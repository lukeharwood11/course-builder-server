const Joi = require('joi')

const userType = {
    TEACHER: 'teacher', 
    STUDENT: 'student'
}

// must be 8 characters long - can use special characters
const passwordRegex = /^[a-zA-Z0-9!@#*$%^&.,';()/\\-]{8,}$/

const schema = Joi.object({
    firstName: Joi.string()
        .required(),
    
    lastName: Joi.string()
        .required(),

    password: Joi.string()
        // minimum 8 characters one required number
        .pattern(passwordRegex)
        .required(),

    repeatPassword: Joi.ref('password'),

    email: Joi.string().required(),

    type: Joi.string().valid(userType.TEACHER, userType.STUDENT).required(),
})

module.exports = {
    userType, schema
}