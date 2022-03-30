const Joi = require("joi");

const colors = ['blue', 'orange', 'green', 'red', 'purple', 'pink', 'lime', 'sky', 'grey']

const validateBoard = boardData => {
    const schema = Joi.object({
        id: Joi.string().label("Id"),
        name: Joi.string().min(3).max(16384).required().label("Name"),
        desc: Joi.string().min(3).max(16384).required().label("Description"),
        color: Joi.string().valid(...colors).required().label("Color"),
        createAt: Joi.any().label('Create at')
    })
    return schema.validate(boardData)
}

module.exports = { 
    validateBoard
}