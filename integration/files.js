const fs = require('fs')

function writeDateToFile(data, file){
    if(!data || !file)
        throw new Error('incorrect data')

    fs.writeFileSync(`${__dirname}/databases/${file}`, data)
}

module.exports = {
    writeDateToFile
}