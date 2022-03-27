const Joi = require("joi");

const validateBoard = boardData => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required().label("Name"),
        description: Joi.string().min(3).required().label("Description"),
        color: Joi.string().required().label("Color")
    })
    return schema.validate(boardData)
}

const validateCard = boardData => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required().label("Name"),
        description: Joi.string().min(3).required().label("Description")
    })
    return schema.validate(boardData)
}


module.exports = {
    validateBoard,
    validateCard
}