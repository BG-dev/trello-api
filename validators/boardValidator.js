const Joi = require("joi");

const colors = ['blue', 'orange', 'green', 'red', 'purple', 'pink', 'lime', 'sky', 'grey']

const validateBoard = boardData => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required().label("Name"),
        description: Joi.string().min(3).required().label("Description"),
        color: Joi.string().valid(...colors) .required().label("Color")
    })
    return schema.validate(boardData)
}

module.exports = { 
    validateBoard
}