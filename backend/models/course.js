const Joi = require('joi')
// name, courseCode, tags, subject

const schema = Joi.object({
    name: Joi.string().required().trim(),
    code: Joi.string().trim().allow(''),
    tags: Joi.array().items(Joi.string()),
    subject: Joi.string().required().trim(),
})

module.exports = {
    schema
}