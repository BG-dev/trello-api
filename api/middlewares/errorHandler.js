const logger = require('./logger')

function logError(err, req, res, next){
    logger.error(err)
    next(err)
}

function sendError(err, req, res, next){
    res.send({message: `${err}`})
}

module.exports = {
    logError,
    sendError
}