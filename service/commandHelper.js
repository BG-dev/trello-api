const { parseDataToJson } = require('./parser')
const { writeDateToFile } = require('../integration/files')

function writeDataToJsonFile(data, file){
    jsonBoards = parseDataToJson(data)
    writeDateToFile(jsonBoards, file)
}

module.exports = {
    writeDataToJsonFile
}