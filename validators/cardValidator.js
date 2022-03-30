const Joi = require("joi");

const statuses = ['To Do', 'Doing', 'Done']

const validateCard = cardData => {
    const schema = Joi.object({
        id: Joi.string().label("Id"),
        boardId: Joi.string().required().label("Board id"),
        listId: Joi.string().label("List id"),
        name: Joi.string().min(3).max(16384).required().label("Name"),
        desc: Joi.string().min(3).max(16384).required().label("Description"),
        createAt: Joi.any().label("Create at"),
        status : Joi.string().valid(...statuses).required().label("Status"),
        dueDate: Joi.string().required().label("Due date"),
        labels: Joi.array().items(Joi.string()).label("Labels")
    })
    return schema.validate(cardData)
}

module.exports = { 
    validateCard
}