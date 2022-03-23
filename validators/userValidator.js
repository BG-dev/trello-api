const Joi = require("joi");

const validateUser = userData => {
    const schema = Joi.object({
        login: Joi.string().min(3).max(30).required().label("Login"),
        password: Joi.string().min(3).max(30).required().label("Password")
    })
    return schema.validate(userData)
}

module.exports = validateUser
