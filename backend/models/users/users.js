const Joi = require('joi')

const userType = {
    TEACHER: 'teacher', 
    STUDENT: 'student'
}

const schema = Joi.object({
    firstName: Joi.string()
        .required(),
    
    lastName: Joi.string()
        .required(),

    password: Joi.string()
        // minimum 8 characters one required number
        .alphanum().required(),

    repeatPassword: Joi.ref('password'),

    email: Joi.string().required(),

    type: Joi.string().valid(userType.TEACHER, userType.STUDENT).required(),
})

module.exports = {
    userType, schema
}